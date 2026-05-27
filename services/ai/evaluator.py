import json
import re
import os
from google import genai
from .prompts import EVALUATE_ANSWER_PROMPT
import time
from dotenv import load_dotenv
from materials.services.retrieval_service import search_chunks
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def evaluate_open_answer(question, student_answer, topic_name, reference_answer=None,material_text=None):
    print(f"\n🔥 DEBUG: Function called with question='{question[:50]}...', answer='{student_answer[:50]}...', topic='{topic_name}', reference='{reference_answer}'")
    try:
        print("\n================ AI DEBUG START ================")

        # =========================
        # 🧠 PROMPT
        # =========================
        search_query = f"""
        Topic: {topic_name}

        Question:
        {question}

        Expected Answer:
        {reference_answer or ""}

        Student Answer:
        {student_answer}
        """

        retrieved_chunks = search_chunks(search_query)

        retrieved_text = "\n\n".join([
            chunk.chunk_text
            for chunk in retrieved_chunks
        ])

        print("\n📚 RETRIEVED EVALUATION CHUNKS:\n")
        print(retrieved_text)
    

        print("\n📚 RETRIEVED EVALUATION CHUNKS:\n")
        print(retrieved_text)
        prompt = EVALUATE_ANSWER_PROMPT.format(
            topic=topic_name,
            question=question,
            answer=student_answer,
            reference=reference_answer or "Not provided",
            # material_text=material_text or "No lecture material provided"
            material_text=retrieved_text or material_text or "No lecture material provided"
        )

        print("📤 PROMPT:\n", prompt)

        # =========================
        # 🤖 API CALL (NEW SDK) WITH RETRY + MODEL FALLBACK
        # =========================
        model_candidates = [
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
            "gemini-flash-latest"
        ]
        max_retries = 3
        response = None
        last_error = None

        for model_name in model_candidates:
            print(f"🔧 Trying model: {model_name}")
            for attempt in range(max_retries):
                try:
                    start_time = time.time()
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    # 🔥 timeout safeguard
                    if time.time() - start_time > 20:
                        raise TimeoutError("Gemini request timeout")
                    print(f"✅ Successfully called model: {model_name}")
                    break
                except Exception as e:
                    last_error = e
                    if "503" in str(e) and attempt < max_retries - 1:
                        wait_time = min(2 ** attempt, 10)
                        print(f"🔄 RETRY {attempt + 1}/{max_retries} in {wait_time}s due to 503")
                        time.sleep(wait_time)
                        continue
                    if "404" in str(e) and "model" in str(e).lower():
                        print(f"⚠️ Model {model_name} unavailable, trying next model")
                        break
                    raise
            if response is not None:
                break

        if response is None:
            if last_error is not None:
                raise last_error
            return None, "Evaluation pending"

        print("\n📥 FULL RESPONSE OBJECT:")
        print(response)
        print("Response type:", type(response))
        print("Response attributes:", dir(response))

        # Check response structure
        if hasattr(response, 'candidates') and response.candidates:
            print("✅ Candidates found:", len(response.candidates))
        else:
            print("❌ No candidates in response")

        # =========================
        # 🔍 RAW TEXT
        # =========================
        try:
            text = response.text
            print("✅ Successfully got text, length:", len(text) if text else 0)
        except Exception as text_error:
            print("❌ ERROR GETTING response.text:", text_error)
            print("Error type:", type(text_error))
            print("Error args:", text_error.args)
            # Try alternative access
            try:
                if hasattr(response, 'candidates') and response.candidates and response.candidates[0].content.parts:
                    text = response.candidates[0].content.parts[0].text
                    print("✅ Got text from candidates, length:", len(text) if text else 0)
                else:
                    print("❌ No text available in response")
                    return None, "Evaluation pending"
            except Exception as alt_error:
                print("❌ Alternative text access failed:", alt_error)
                print("Alt error type:", type(alt_error))
                print("Alt error args:", alt_error.args)
                return None, "Evaluation pending"

        if not text:
            print("❌ EMPTY TEXT RESPONSE")
            return None, "Evaluation pending"

        text = text.strip()

        print("\n🧠 RAW TEXT:")
        print(repr(text))  # Use repr to see exact characters including newlines

        # =========================
        # 🔥 JSON EXTRACTION
        # =========================
        # Try to find complete JSON objects, preferring the last one if multiple exist
        json_matches = re.findall(r'\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\}', text)
        
        if not json_matches:
            print("❌ NO JSON FOUND IN TEXT")
            print("Full text:", repr(text))
            return None, "Evaluation pending"

        # Use the last complete JSON object found (often the best one)
        json_text = json_matches[-1]

        print("\n📦 EXTRACTED JSON:")
        print(repr(json_text))

        # =========================
        # 🔥 JSON PARSE WITH FALLBACK
        # =========================
        try:
            data = json.loads(json_text)
        except Exception as e:
            print("❌ JSON PARSE ERROR:", e)
            print("Attempted to parse:", repr(json_text))
            
            # Try to extract score and feedback manually if JSON is malformed
            score_match = re.search(r'"score"\s*:\s*(\d+)', json_text)
            feedback_match = re.search(r'"feedback"\s*:\s*"([^"]*)"', json_text)
            
            if score_match and feedback_match:
                score = float(score_match.group(1))
                feedback = feedback_match.group(1)
                print("✅ MANUAL EXTRACTION SUCCESS:", score, feedback)
                data = {"score": score, "feedback": feedback}
            else:
                return None, "Evaluation pending"

        print("\n✅ PARSED DATA:", data)

        # =========================
        # 🔢 SCORE
        # =========================
        score = float(data.get("score", 0))
        feedback = data.get("feedback", "")

        score = max(0, min(score, 100))

        print(f"\n🎯 FINAL SCORE: {score}")
        print(f"💬 FEEDBACK: {feedback}")

        print("================ AI DEBUG END ================\n")

        return score, feedback
    except Exception as e:
        print("\n🔥 CRITICAL AI ERROR:", e)

        if "503" in str(e):
            return None, "AI busy, try again"
        if "429" in str(e):
            return None, "Quota exceeded"
        if "404" in str(e):
            return None, "Model unavailable"

        return None, "Evaluation pending"
