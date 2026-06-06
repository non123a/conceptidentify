from django.urls import path

from api.views.topic_api import (
    course_topics,
    create_topic,
    topic_detail,
)
from api.views.topic_api import (
    course_topics,
    create_topic,
)

from api.views.question_api import (
    topic_questions,
    create_question,
    generate_topic_questions,
    bulk_create_questions,
    toggle_question_status,
    delete_question,
    edit_question,
)

from api.views.course_api import (
    my_courses,
    course_detail,
    create_course,
    join_course,
)
from api.views.material_api import (
    upload_material,
    course_materials,
    topic_materials,
    delete_material,
)
from api.views.material_api import (
    upload_material,
)
from api.views.material_api import (
    upload_material,
    course_materials,
)

from api.views.student_api import (
    get_student_quiz,
    submit_student_quiz,
    get_student_results,
    get_practice_questions,
    submit_practice_questions,
)

from api.views.analytics_api import (
    student_analytics,
    lecturer_analytics,
    student_topic_analytics,
    topic_analytics,
)
urlpatterns = [

    path(
        "courses/",
        my_courses,
        name="my_courses",
    ),
    path(
        "courses/create/",
        create_course,
        name="create_course",
    ),

    path(
        "materials/upload/",
        upload_material,
        name="upload_material",
    ),
    path(
        "courses/<int:course_id>/",
        course_detail,
        name="course_detail",
    ),
    path(
        "courses/<int:course_id>/materials/",
        course_materials,
        name="course_materials",
    ),
    path(
        "materials/<int:material_id>/delete/",
        delete_material,
        name="delete_material",
    ),
    path(
        "courses/<int:course_id>/topics/",
        course_topics,
        name="course_topics",
    ),

    path(
        "courses/<int:course_id>/topics/create/",
        create_topic,
        name="create_topic",
    ),
    path(
        "courses/join/",
        join_course,
        name="join_course",
    ),
    path(
        "topics/<int:topic_id>/",
        topic_detail,
        name="topic_detail",
    ),
    path(
        "topics/<int:topic_id>/materials/",
        topic_materials,
        name="topic_materials",
    ),
    path(
        "topics/<int:topic_id>/questions/",
        topic_questions,
        name="topic_questions",
    ),
    path(
        "topics/<int:topic_id>/questions/create/",
        create_question,
        name="create_question",
    ),
    path(
        "topics/<int:topic_id>/generate/",
        generate_topic_questions,
        name="generate_questions",
    ),

    path(
        "topics/<int:topic_id>/bulk-create/",
        bulk_create_questions,
        name="bulk_create_questions",
    ),
    path(
        "topics/<int:topic_id>/student-analytics/",
        student_topic_analytics
    ),
    path(
        "questions/<int:question_id>/toggle/",
        toggle_question_status,
        name="toggle_question_status",
    ),
    path(
        "questions/<int:question_id>/delete/",
        delete_question,
        name="delete_question",
    ),
    path(
        "questions/<int:question_id>/edit/",
        edit_question,
        name="edit_question",
    ),
    
    # ====================================
    # STUDENT QUIZ ENDPOINTS
    # ====================================
    path(
        "topics/<int:topic_id>/quiz/",
        get_student_quiz,
        name="get_student_quiz",
    ),
    path(
        "topics/<int:topic_id>/submit/",
        submit_student_quiz,
        name="submit_student_quiz",
    ),
    path(
        "topics/<int:topic_id>/results/",
        get_student_results,
        name="get_student_results",
    ),
    path(
        "topics/<int:topic_id>/practice/",
        get_practice_questions,
        name="get_practice_questions",
    ),
    path(
        "topics/<int:topic_id>/practice/submit/",
        submit_practice_questions,
        name="submit_practice_questions",
    ),
    
    # ====================================
    # ANALYTICS ENDPOINTS
    # ====================================
    path(
        "courses/<int:course_id>/student-analytics/",
        student_analytics,
        name="student_analytics",
    ),
    path(
        "courses/<int:course_id>/lecturer-analytics/",
        lecturer_analytics,
        name="lecturer_analytics",
    ),
    path(
        "topics/<int:topic_id>/analytics/",
        topic_analytics,
        name="topic_analytics",
    ),
            
]
