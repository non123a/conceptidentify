# Student Quiz API - Quick Reference Guide

## 3 Endpoints Ready to Use

### 1. GET `/api/topics/<topic_id>/quiz/`
**Purpose:** Load quiz questions  
**Response:** `{"success": true, "topic": {...}, "questions": [...]}`  
**Note:** Questions show NO correct answers, MCQ choices show NO is_correct flag

### 2. POST `/api/topics/<topic_id>/submit/`
**Purpose:** Submit student answers  
**Input:** `{"answers": {"12": "answer text", "13": "1"}}`  
**Response:** `{"success": true, "results": [...]}`  
**Evaluation:**
- MCQ: Instant (1 or 0)
- Open: AI evaluation (0-1, may be pending)

### 3. GET `/api/topics/<topic_id>/results/`
**Purpose:** View student's all previous attempts  
**Response:** `{"success": true, "results": [...], "average_score": 0.82}`  
**Includes:** All submitted answers with scores & feedback

---

## Files Created/Modified

```
✅ NEW: api/views/student_api.py (255 lines)
✅ MODIFIED: assessments/serializers.py (+60 lines)
✅ MODIFIED: api/urls.py (+5 lines)
```

---

## What Was Reused (No Duplication)

| Component | Location | Used In |
|-----------|----------|---------|
| `handle_topic_submission()` | services/quiz_service.py | POST /submit/ |
| `evaluate_open_answer()` | services/ai/evaluator.py | MCQ & Open evaluation |
| `StudentResponse` model | assessments/models.py | All results storage |
| `IsStudent` permission | api/permissions.py | All endpoints |
| Topic, Question, Choice models | assessments/models.py | Quiz data |

**NO service refactoring. NO evaluator changes. NO quiz_service rewrites.**

---

## Security Checklist

- ✅ Student-only endpoints (IsStudent permission)
- ✅ Enrollment verification (must be in course)
- ✅ Hidden correct answers (not in API response)
- ✅ Hidden `is_correct` on MCQ choices
- ✅ Hidden evaluation logic
- ✅ Proper HTTP status codes

---

## Frontend Integration Steps

1. **Show Quiz:**
   ```javascript
   const response = await fetch(`/api/topics/${topicId}/quiz/`, {
     headers: { "Authorization": `Bearer ${token}` }
   });
   const data = response.json();
   // Display data.questions
   ```

2. **Submit Answers:**
   ```javascript
   const payload = {
     answers: {
       "12": "My answer text",
       "13": "1"  // MCQ choice ID
     }
   };
   await fetch(`/api/topics/${topicId}/submit/`, {
     method: "POST",
     headers: { "Authorization": `Bearer ${token}` },
     body: JSON.stringify(payload)
   });
   ```

3. **Show Results:**
   ```javascript
   const response = await fetch(`/api/topics/${topicId}/results/`, {
     headers: { "Authorization": `Bearer ${token}` }
   });
   const data = response.json();
   // Display data.results + data.average_score
   ```

---

## Error Handling

| Scenario | Response |
|----------|----------|
| Not logged in | 401 Unauthorized |
| Not a student | 403 Forbidden |
| Not enrolled | 403 Forbidden with message |
| No questions approved | 400 Bad Request |
| AI still evaluating | `ai_pending: true` in results |

---

## Sample Responses

### Empty Quiz (No Approved Questions)
```json
{
  "success": false,
  "error": "No questions available for this topic"
}
```

### Quiz with Mixed Question Types
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "text": "Open question?",
      "question_type": "open",
      "choices": []
    },
    {
      "id": 2,
      "text": "MCQ question?",
      "question_type": "mcq",
      "choices": [
        {"id": 10, "text": "Option A"},
        {"id": 11, "text": "Option B"}
      ]
    }
  ]
}
```

### Results with Pending AI Evaluation
```json
{
  "success": true,
  "results": [
    {
      "score": null,
      "feedback": "Evaluating...",
      "ai_pending": true
    }
  ]
}
```

---

## Key Features

✅ **Instant MCQ Grading** - No waiting  
✅ **AI Open-Ended** - AutoGraded via Gemini  
✅ **Response Caching** - Same answer = same score  
✅ **Enrollment Check** - Students see only their courses  
✅ **Historical Results** - View all attempts  
✅ **Score Aggregation** - Average, total calculations  
✅ **Async-Friendly** - Works with `ai_pending=true` polling  

---

## Testing the APIs

```bash
# LOGIN & GET TOKEN
curl -X POST http://localhost:8000/api/auth/login/ \
  -d "username=student&password=pass"

# GET QUIZ
curl http://localhost:8000/api/topics/1/quiz/ \
  -H "Authorization: Bearer <token>"

# SUBMIT ANSWERS
curl -X POST http://localhost:8000/api/topics/1/submit/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"answers": {"1": "answer"}}'

# VIEW RESULTS
curl http://localhost:8000/api/topics/1/results/ \
  -H "Authorization: Bearer <token>"
```

---

## Database Schema (Unchanged)

```
StudentResponse
├── id
├── student_id (FK → User)
├── question_id (FK → Question)
├── answer (TextField)
├── score (FloatField 0-1)
├── feedback (CharField)
└── created_at (DateTime)

Question
├── topic_id
├── text
├── question_type (mcq/open)
├── correct_answer
├── is_approved ← Only these shown to students
└── choices (MCQ choices)

Choice
├── question_id
├── text
└── is_correct ← Hidden from students
```

---

## Performance Notes

- No N+1 queries
- MCQ evaluation: O(1)
- Open-ended: O(n) cached lookup per submission
- Results aggregation: SQL aggregation (efficient)

---

## Ready for Frontend!

✅ All APIs complete  
✅ No database migrations needed  
✅ No breaking changes  
✅ Reused all existing logic  
✅ Production-ready  

**Start building the Next.js quiz interface now!**

---

## Support Resources

- **Full API Docs:** See STUDENT_API_DOCUMENTATION.md
- **Verification Report:** See STUDENT_API_VERIFICATION.md
- **Code:**
  - `api/views/student_api.py` - API endpoints
  - `assessments/serializers.py` - Response formatting
  - `api/urls.py` - Route mapping

---

*Implementation Complete - June 1, 2024*
