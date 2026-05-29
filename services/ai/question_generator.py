import os
import json
import re
import time
from google import genai
from dotenv import load_dotenv
from materials.services.retrieval_service import search_chunks

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(topic_name, material_text, num_questions=3, question_type="mcq", custom_prompt=""):

    print("\n================ GENERATE AI START ================")
    retrieved_chunks = search_chunks(topic_name)

    retrieved_text = "\n\n".join([
        chunk.chunk_text
        for chunk in retrieved_chunks
    ])
    print("\n📚 RETRIEVED CHUNKS:\n")
    print(retrieved_text)

    context_text = (
        retrieved_text
        if retrieved_text.strip()
        else material_text
    )
    if question_type == "mcq":

        question_rules = """
        - Generate multiple choice questions
        - Include 4 plausible choices
        - Only 1 correct answer
        - Distractors must be believable
        - Focus on conceptual understanding
        """

    elif question_type == "open":

        question_rules = """
        - Generate open-ended questions
        - Questions should encourage explanation and reasoning
        - Avoid yes/no questions
        - Include a strong reference answer
        - Focus on understanding and application
        """
    if question_type == "mcq":

        json_format = f"""
    [
    {{
        "question": "...",
        "type": "{question_type}",
        "choices": ["A", "B", "C", "D"],
        "correct_answer": "..."
    }}
    ]
    """

    elif question_type == "open":

        json_format = f"""
    [
    {{
        "question": "...",
        "type": "{question_type}",
        "reference_answer": "..."
    }}
    ]
    """
    prompt = f"""
You are an educational assistant.

Generate {num_questions} {question_type.upper()} questions.

Question Rules:
{question_rules}

Custom Instruction:
{custom_prompt}

IF MCQ:
- 4 choices
- 1 correct answer

IF OPEN:
- include reference_answer

Return ONLY valid JSON:

{json_format}
Topic:
{topic_name}

Retrieved Learning Material:
{context_text}
"""

    model_candidates = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-flash-latest"
    ]

    max_retries = 3
    response = None
    last_error = None

    # =========================
    # 🔁 MODEL + RETRY LOOP
    # =========================
    for model_name in model_candidates:
        print(f"🔧 Trying model: {model_name}")

        for attempt in range(max_retries):
            try:
                start_time = time.time()

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )

                # if time.time() - start_time > 10:
                #     print("⏱ TIMEOUT")
                #     return []
                if time.time() - start_time > 20:
                    raise TimeoutError("Gemini request timeout")

                print(f"✅ SUCCESS with {model_name}")
                break

            except Exception as e:
                last_error = e
                error_text = str(e).lower()

                is_temporary_failure = (
                    "503" in error_text
                    or "unavailable" in error_text
                    or isinstance(e, TimeoutError)
                )

                if is_temporary_failure and attempt < max_retries - 1:
                    wait = min(2 ** attempt, 10)
                    print(f"🔄 RETRY {attempt+1} in {wait}s")
                    time.sleep(wait)
                    continue

                if "404" in error_text:
                    print(f"⚠️ Model {model_name} unavailable")
                    break

                print(f"⚠️ Model {model_name} failed:", e)
                break

        if response is not None:
            break

    if response is None:
        print("❌ ALL MODELS FAILED:", last_error)
        return []

    # =========================
    # 🔍 GET TEXT SAFELY
    # =========================
    try:
        text = response.text
    except:
        try:
            text = response.candidates[0].content.parts[0].text
        except:
            print("❌ NO TEXT FOUND")
            return []

    if not text:
        print("❌ EMPTY RESPONSE")
        return []

    print("\n🧠 RAW TEXT:\n", text)

    # =========================
    # 🔥 EXTRACT JSON
    # =========================
    match = re.search(r'\[.*\]', text, re.DOTALL)

    if not match:
        print("❌ NO JSON FOUND")
        return []

    json_text = match.group(0)

    print("\n📦 JSON FOUND:\n", json_text)

    # =========================
    # 🔥 PARSE JSON
    # =========================
    try:
        data = json.loads(json_text)
    except Exception as e:
        print("❌ JSON ERROR:", e)
        return []

    print("\n✅ FINAL QUESTIONS:", data)
    print("================ GENERATE AI END ================\n")

    return data
