import os
import json
import re
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_questions(topic_name, material_text, num_questions=3, question_type="mcq", custom_prompt=""):

    print("\n================ GENERATE AI START ================")

    prompt = f"""
You are an educational assistant.

Generate {num_questions} {question_type.upper()} questions.

STRICT RULES:
- Use ONLY the material provided
- No outside knowledge
- Clear and simple

Custom Instruction:
{custom_prompt}

IF MCQ:
- 4 choices
- 1 correct answer

IF OPEN:
- include reference_answer

Return ONLY JSON:

[
  {{
    "question": "...",
    "type": "{question_type}",
    "choices": ["A","B","C","D"],
    "correct_answer": "..."
  }}
]

Topic:
{topic_name}

Material:
{material_text}
"""

    model_candidates = [
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
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

                if time.time() - start_time > 10:
                    print("⏱ TIMEOUT")
                    return []

                print(f"✅ SUCCESS with {model_name}")
                break

            except Exception as e:
                last_error = e

                if "503" in str(e) and attempt < max_retries - 1:
                    wait = min(2 ** attempt, 10)
                    print(f"🔄 RETRY {attempt+1} in {wait}s")
                    time.sleep(wait)
                    continue

                if "404" in str(e):
                    print(f"⚠️ Model {model_name} unavailable")
                    break

                raise

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