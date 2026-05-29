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
)

from api.views.course_api import (
    my_courses,
    course_detail,
)
from api.views.material_api import (
    upload_material,
    course_materials,
    topic_materials,
)
from api.views.material_api import (
    upload_material,
)
from api.views.material_api import (
    upload_material,
    course_materials,
)
urlpatterns = [

    path(
        "courses/",
        my_courses,
        name="my_courses",
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
            
]