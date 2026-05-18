from django.urls import path
from .views import course_detail, create_course, create_question, create_topic, generate_topic_questions, student_courses, student_dashboard, topic_performance, topic_question_bank, topic_questions, topic_result, bulk_create_questions , edit_question, delete_question , toggle_question_status
from .views import join_course
from .views import lecturer_dashboard
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('dashboard/<int:course_id>/', student_dashboard, name='student_dashboard'),
    path('lecturer-dashboard/<int:course_id>/', lecturer_dashboard, name='lecturer_dashboard'),
    path('join/', join_course, name='join_course'),   # 🔥 NEW
    path('my-courses/', student_courses, name='student_courses'),
    path('<int:course_id>/', course_detail, name='course_detail'),
    path('create/', create_course, name='create_course'),
    path('<int:course_id>/topic/<int:topic_id>/', topic_questions, name='topic_questions'),
    path('<int:course_id>/topic/<int:topic_id>/performance/', topic_performance, name='topic_performance'),
    path('<int:course_id>/topic/<int:topic_id>/questions/', topic_question_bank, name='topic_question_bank'),
    path('<int:course_id>/topic/<int:topic_id>/result/', topic_result, name='topic_result'),
    path('<int:course_id>/create-topic/', create_topic, name='create_topic'),
    path('<int:course_id>/topic/<int:topic_id>/create-question/', create_question, name='create_question'),
    path('<int:course_id>/topic/<int:topic_id>/generate/', generate_topic_questions, name='generate_questions'),
    path('<int:course_id>/topic/<int:topic_id>/bulk-create/',bulk_create_questions,name='bulk_create_questions'),
    path('<int:course_id>/topic/<int:topic_id>/question/<int:question_id>/edit/',edit_question,name='edit_question'),
    path('<int:course_id>/topic/<int:topic_id>/question/<int:question_id>/delete/',delete_question,name='delete_question'),
    path('<int:course_id>/topic/<int:topic_id>/question/<int:question_id>/toggle/',toggle_question_status,name='toggle_question_status'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )