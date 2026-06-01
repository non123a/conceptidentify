# Student Quiz API Implementation

## Summary

Implemented 3 student-facing REST API endpoints for the quiz system, reusing existing backend logic without duplication.

## Endpoints Added

### 1. GET `/api/topics/<topic_id>/quiz/`

**Purpose:** Return approved questions for a topic (student assessment view)

**Permissions:** 
- `IsAuthenticated`
- `IsStudent` role only
- Must be enrolled in the course

**Response Format:**
```json
{
  "success": true,
  "topic": {
    "id": 1,
    "name": "Constitutional Law",
    "description": "...",
    "material_count": 3,
    "question_count": 5
  },
  "questions": [
    {
      "id": 12,
      "text": "What is the first amendment?",
      "question_type": "open",
      "choices": []
    },
    {
      "id": 13,
      "text": "What year was the Constitution signed?",
      "question_type": "mcq",
      "choices": [
        {"id": 1, "text": "1787"},
        {"id": 2, "text": "1791"},
        {"id": 3, "text": "1865"}
      ]
    }
  ]
}
```

**Security:**
- ✅ Only `is_approved=True` questions returned
- ✅ `correct_answer` field NOT exposed
- ✅ MCQ choices include only `id` and `text` (no `is_correct`)

---

### 2. POST `/api/topics/<topic_id>/submit/`

**Purpose:** Student submits answers for a quiz

**Permissions:** 
- `IsAuthenticated`
- `IsStudent` role only
- Must be enrolled in the course

**Request Format:**
```json
{
  "answers": {
    "12": "Civil law focuses on...",
    "13": "1"
  }
}
```

**Note:** Question IDs as strings in the `answers` object

**Response Format:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "is_retry": false,
  "results": [
    {
      "question": "What is civil law?",
      "answer": "Civil law focuses on...",
      "score": 75.5,
      "type": "open",
      "feedback": "Good understanding of civil law principles...",
      "ai_pending": false
    },
    {
      "question": "What year was the Constitution signed?",
      "answer": "1787",
      "score": 1,
      "type": "mcq",
      "feedback": "",
      "ai_pending": false
    }
  ]
}
```

**What Happens:**
- Reuses `handle_topic_submission()` from `services/quiz_service.py`
- MCQ answers evaluated immediately (1 for correct, 0 for incorrect)
- Open-ended answers sent to AI evaluator (Claude/Gemini)
- Responses cached in `StudentResponse` table
- `ai_pending=true` if evaluation still in progress

---

### 3. GET `/api/topics/<topic_id>/results/`

**Purpose:** Return student's quiz results for a topic

**Permissions:** 
- `IsAuthenticated`
- `IsStudent` role only
- Must be enrolled in the course

**Response Format:**
```json
{
  "success": true,
  "topic": {
    "id": 1,
    "name": "Constitutional Law",
    "description": "...",
    "material_count": 3,
    "question_count": 5
  },
  "total_responses": 5,
  "average_score": 0.82,
  "total_score": 4.1,
  "results": [
    {
      "id": 101,
      "question_text": "What is the first amendment?",
      "question_type": "open",
      "answer": "The first amendment protects...",
      "score": 0.9,
      "feedback": "Excellent! Your answer...",
      "created_at": "2024-06-01T14:30:00Z"
    },
    {
      "id": 102,
      "question_text": "What year was the Constitution signed?",
      "question_type": "mcq",
      "answer": "1787",
      "score": 1.0,
      "feedback": "",
      "created_at": "2024-06-01T14:32:00Z"
    }
  ]
}
```

---

## Files Changed

### 1. `api/views/student_api.py` (NEW)
- Created 3 endpoints: `get_student_quiz()`, `submit_student_quiz()`, `get_student_results()`
- 255 lines
- Fully commented with docstrings

### 2. `assessments/serializers.py` (MODIFIED)
- Added `ChoiceForStudentSerializer`
- Added `QuestionForStudentSerializer`
- Added `StudentResponseSerializer`
- Student-facing serializers exclude sensitive data

### 3. `api/urls.py` (MODIFIED)
- Imported 3 new functions from `student_api`
- Added 3 new URL patterns

---

## Reuse of Existing Backend Logic

✅ **`services/quiz_service.py`** - Reused completely
- Function: `handle_topic_submission()`
- Handles MCQ evaluation (immediate)
- Handles open-ended submission (AI evaluation)
- Returns scores and feedback

✅ **`services/ai/evaluator.py`** - Reused completely
- Function: `evaluate_open_answer()`
- Integrated into `quiz_service`
- Requires GEMINI_API_KEY in `.env`

✅ **`assessments.models.StudentResponse`** - Reused completely
- Stores: student, question, answer, score, feedback
- No changes needed

✅ **`api.permissions.IsStudent`** - Reused
- Already existed
- Used for permission checks

✅ **Existing Models:**
- `Topic`, `Question`, `Choice`, `Course`, `Enrollment`, `User`
- No migrations needed

---

## Input Validation & Error Handling

| Error | HTTP Status | Response |
|-------|------------|----------|
| Not enrolled in course | 403 Forbidden | `{"success": false, "error": "Not enrolled in this course"}` |
| No question found | 404 Not Found | Django default |
| No answers provided | 400 Bad Request | `{"success": false, "error": "No answers provided"}` |
| No approved questions | 400 Bad Request | `{"success": false, "error": "No questions available..."}` |
| Invalid question ID | 400 Bad Request | Silently skipped |

---

## MCQ Flow

1. Student answers MCQ with choice ID (or text)
2. In `submit_student_quiz()`: Convert choice ID to choice text
3. In `handle_topic_submission()`: Compare choice ID with `is_correct`
4. Score: 1 (correct) or 0 (incorrect)
5. Stored in `StudentResponse`

**Example:**
```
Input: {"answers": {"13": "1"}}  ← Choice ID = 1
↓
StudentResponse.answer = "1787"  ← Converted by quiz_service
StudentResponse.score = 1         ← MCQ immediate evaluation
```

---

## Open-Ended Flow

1. Student submits text answer
2. In `submit_student_quiz()`: Pass answer to `handle_topic_submission()`
3. In `handle_topic_submission()`: Check for cached evaluation
4. If cached: Use existing score/feedback
5. If new: Call `evaluate_open_answer()` → AI API
6. Score: 0-1 (decimals for partial credit)
7. Feedback: Human-readable evaluation
8. `ai_pending=true` if still evaluating

**Example:**
```
Input: {"answers": {"12": "Civil law focuses on..."}}
↓
Cache check: StudentResponse with same question + same answer?
  - YES: Use cached score (0.85) and feedback
  - NO: Call Gemini API
     → ai_score = 82/100 = 0.82
     → ai_feedback = "Good understanding..."
     → Save to StudentResponse
Response: {"ai_pending": false, "score": 0.82, "feedback": "..."}
```

---

## User Story Examples

### Scenario 1: Student Takes Quiz (MCQ + Open)
```
GET /api/topics/1/quiz/
← {"topic": {...}, "questions": [...]}

POST /api/topics/1/submit/
→ {"answers": {"12": "Text answer", "13": "1"}}
← {"success": true, "results": [...]}

GET /api/topics/1/results/
← {"total_responses": 2, "average_score": 0.9, "results": [...]}
```

### Scenario 2: Student Retakes Quiz
- Old response with same question preserved
- `is_retry=true` returned
- New StudentResponse created
- Front-end can show comparison

### Scenario 3: AI Still Evaluating
- Open question submitted
- Gemini API slow or error
- Response: `{"ai_pending": true, "feedback": "Evaluating..."}`
- Student can retry GET with exponential backoff

---

## Frontend Integration Checklist

- [ ] Implement quiz loading screen
- [ ] Build answer form (MCQ radios, open text input)
- [ ] POST answers with correct JSON format
- [ ] Handle `ai_pending=true` with retry logic
- [ ] Display results summary + detailed feedback
- [ ] Show historical attempts

---

## Testing Commands

```bash
# Start server
python manage.py runserver

# Create test student (if needed)
python manage.py shell
>>> from users.models import User
>>> User.objects.create_user(username='test_student', role='student', password='pass')

# Enroll in course
>>> from courses.models import Enrollment, Course
>>> enrollment = Enrollment.objects.create(
...   student=User.objects.get(username='test_student'),
...   course=Course.objects.first()
... )

# Test GET quiz
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/topics/1/quiz/

# Test POST submit
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"answers": {"1": "answer text"}}' \
  http://localhost:8000/api/topics/1/submit/

# Test GET results
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/topics/1/results/
```

---

## Blockers For Frontend

**None.** All backend APIs are complete and functional:

- ✅ Authentication via JWT/Session
- ✅ Permission checks for enrolled students only
- ✅ Question filtering (approved only)
- ✅ MCQ instant evaluation
- ✅ Open-ended AI evaluation (async-friendly)
- ✅ Response caching
- ✅ Results aggregation

**Frontend ready to:**
1. Fetch quiz questions
2. Collect student answers
3. Submit for evaluation
4. Display results + feedback

---

## Tech Stack Used

- **Framework:** Django REST Framework
- **Permissions:** Custom `IsStudent` class
- **Serializers:** DRF ModelSerializer
- **AI Evaluation:** Gemini API (via `services/ai/evaluator.py`)
- **Database:** StudentResponse model
- **Caching:** In-database (query on same question+answer)

---

## Performance Notes

- No N+1 queries (uses `.select_related()` in serializers if needed)
- MCQ evaluation: O(1)
- Open-ended: Cached after first evaluation
- Results endpoint: Aggregates scores efficiently

---

*Implemented by: Student Quiz API Layer - June 1, 2024*
