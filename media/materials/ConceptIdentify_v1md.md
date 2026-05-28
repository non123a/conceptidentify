

**CONCEPTIDENTIFY:** An AI-Assisted Learning Support System for Identifying Students’ Conceptual Learning Difficulties.

**Bachelor’s Capstone**

**CHHANON TENG**

**YEAR 4**

**ConceptIdentify**

**A Capstone**

**Presented to the**  
**Faculty of Information and Computer Technology**  
**Paragon International University, Cambodia**

**In Partial Fulfillment**  
**of the Requirements for the Degree of**  
**Bachelor of Science in Computer Science**

**By**  
**CHHANON TENG**

**December 2025**

**CERTIFICATE OF ORIGINALITY**  
We declare that this Bachelor’s Capstone is our team’s original work and has not been submitted before any institution for assessment purposes. Furthermore, we have acknowledged all sources used and have cited these in the reference section. In addition, the research can not describe the full extent of the project architecture due to private information that can not be shared with the public.

| NAME 1 Date: Month XX, 20XX | NAME 2 Date: Month XX, 20XX |
| :---- | :---- |

**ABSTRACT**

The use of digital learning platforms has made it easier for students to access learning materials such as lecture slides and notes. However, many existing platforms mainly focus on storing and sharing files and provide limited support for helping students understand the learning content. As a result, students often study on their own without guidance, while lecturers find it difficult to know which topics students do not fully understand.

In the classroom, many students are also hesitant to ask or answer questions directly due to fear of being judged or laughed at by their peers. This situation may reduce student participation and prevent lecturers from accurately identifying students' learning difficulties. Therefore, there is a need for a supportive learning system that allows students to engage with learning materials in a more comfortable way.

This project ConceptIdentify, an AI assisted learning support system designed to support lecturers in identifying student learning difficulties. The system allows lecturers to organize learning materials by class and chapter, as well as create practice questions based on course content. Artificial intelligence is used to assist in generating questions; however, all generated content is reviewed and approved by the lecturer to ensure accuracy and alignment with the course syllabus.

In addition, ConceptIdentify provides a supportive learning environment for students to practice answering questions 

and review learning materials. By supporting structured practice and review, the system also enables students to gain clearer insights into common areas where they are struggling.

**Keywords:** Artificial Intelligence, Learning Support System, ConceptIdentify, Practice Questions

# **CHAPTER 1**

# **INTRODUCTION**

This chapter introduces the background and motivation of the project by discussing the challenges faced by lecturers and students. It presents the problem statement, research objectives, scope of the project, and its significance. The chapter also describes the expected contributions of the project and explains how the proposed system is intended to address the identified problems.

## **CONTEXT OF STUDY**

Digital learning platforms are widely used in education to support teaching and learning activities. Universities commonly use systems such as Learning Management Systems (LMS) to share learning materials, manage assignments, and conduct assessments. These platforms help lecturers distribute content efficiently and allow students to access learning materials outside the classroom (Zou et al., 2025).

However, previous studies indicate that the use of digital learning platforms alone does not guarantee effective learning. Research shows that many students still experience difficulty understanding learning materials even when online platforms are regularly used (Gerada & Efondo, 2024; Joshua et al., 2022). One key challenge is that lecturers often have limited visibility into which specific topics students struggle to understand, especially when assessments focus mainly on final scores rather than detailed learning difficulties.

Assessment activities, such as quizzes and practice questions, are commonly used to evaluate student learning. Studies have shown that question based activities can support learning and help lecturers monitor student understanding when used appropriately (Bangert Drowns et al., 1991). However, preparing questions requires significant time and effort from lecturers, which may limit how frequently such activities are used in practice.

In addition, students do not always express their confusion or difficulties during class. Research shows that students may hesitate to ask questions or seek clarification, making it difficult for lecturers to identify learning issues early (Lodge et al., 2018). As a result, learning difficulties may remain unnoticed until formal assessments, reducing opportunities for timely support.

## **PROJECT CONTEXT**

To understand current challenges in identifying student learning gaps, this study conducted a survey involving lecturers from different academic disciplines and teaching experience levels. The survey examined existing assessment practices, difficulties in identifying specific learning gaps, and time related constraints associated with assessment activities.

[![][image1]](https://docs.google.com/forms/d/1bpyPJpBA27ZdbT91Jt989WUHzgzdCYUY8ym2yg_DLdA/edit#responses)

**Figure 1\. Lecturers Currently Assess Student Understanding**

Figure 1 presents how lecturers currently assess student understanding during teaching. The results show that most lecturers rely on formal assessments, with 80% indicating that they assess student understanding mainly through quizzes, tests, or examinations. In addition, 46.7% of lecturers reported checking overall assessment performance, while 40% rely on teaching experience or intuition to estimate which topics students find difficult. Only a small number rely on oral recitation or other methods. These findings indicate that lecturers primarily depend on summative or overall performance indicators rather than direct identification of topic level understanding.

![][image2]

**Figure 2\. Difficulty in Identifying Specific Concepts Students Do Not Understand**

Figure 2 shows lecturers’ perceptions regarding the difficulty of identifying specific concepts or subtopics that students do not understand. A majority of respondents (60%) agreed or strongly agreed that it is difficult to identify which specific concepts students struggle with. This suggests that while lecturers can assess overall performance, identifying exact learning gaps at the concept level remains a significant challenge.

![][image3]

**Figure 3\. Reasons Why Lecturers Face Difficulty Identifying Learning Gaps**

As illustrated in Figure 3, several factors contribute to this difficulty. The most commonly reported reason (93.3%) is that students do not clearly express when they do not understand a lesson. In addition, 46.7% of lecturers indicated that large class sizes make it difficult to track individual student difficulties, while 33.3% cited limited teaching time. These findings highlight that student behavior and classroom constraints significantly limit lecturers’ ability to identify learning problems through traditional teaching methods.

![][image4]

**Figure 4\. Student Answer Do Not Clearly Indicate Misunderstanding**

Figure 4 shows that 53.3% of lecturers agreed that students often answer questions incorrectly without clearly indicating which concept they misunderstood. The results suggest that incorrect answers alone do not provide sufficient insight into students’ underlying misconceptions, making targeted intervention difficult.

![][image5]

**Figure 5\. Impact of Time Constraints on Teaching and Assessment**

Figure 5 highlights the impact of time constraints on lecturers’ teaching practices. More than half of the respondents (53.3%) reported that reviewing student answers one by one to identify learning gaps is time consuming, while 46.7% indicated that they often need to re teach entire topics because they cannot quickly identify the exact concepts students do not understand. This suggests that manual analysis of student responses reduces time available for lesson planning and effective teaching.

![][image6]

**Figure 6\.** **Student Participation in Class Activities**

As shown in Figure 6, a large proportion of students reported confidence and anxiety related reasons for feeling shy or hesitant to participate in class. The most frequently reported reasons were lack of confidence in their understanding (74.3%) and feeling shy speaking in front of classmates (42.9%). In addition, 62.9% of students indicated fear that their answer might be wrong, while 34.3% worried about being judged or laughed at by others. Half of the respondents (40%) also reported preferring to stay quiet even when they are confused.

![][image7]

**Figure 7\.** **Need for a Learning Support System**

**![][image8]**

**Figure 8\.** **Supporting System help reduce time**

Figures 7 and 8 demonstrate lecturers’ perceptions of the need for a supporting system. A majority of respondents (66.7%) agreed or strongly agreed that they would benefit from a system that automatically identifies specific lesson concepts students struggle with. Additionally, 73.3% agreed that analyzing student responses automatically would reduce the time needed to identify learning difficulties. These findings indicate strong lecturer support for a concept level learning identification system.

Open ended responses further reinforce these findings. Several lecturers highlighted that identifying exactly where students are stuck is challenging, particularly when students do not ask questions during class. Others noted that assessment design and quiz preparation require significant time if lecturers aim to ensure conceptual understanding rather than surface level correctness. These responses emphasize the need for a system that supports efficient assessment preparation and clearer identification of student misconceptions.

## **PROJECT DESCRIPTION**

This project proposes ConceptIdentify, a web based learning support system designed to assist lecturers and students throughout the teaching and learning process by identifying student learning difficulties and areas of conceptual misunderstanding. The system functions by organizing learning materials, supporting question based learning activities, and analyzing student responses to provide structured insights into learning performance.

	ConceptIdentify enables lecturers to upload and organize learning materials according to courses, classes, and topics. These materials serve as the basis for generating practice questions with the assistance of artificial intelligence. All AI generated questions are subject to lecturer review, modification, and approval before being released to students. This ensures that the questions are accurate, appropriate, and aligned with the intended learning outcomes and course syllabus.

	Once questions are approved, students use the system to attempt practice questions and review the learning materials provided by the lecturer. The system records student responses and automatically summarizes performance data based on topics and question outcomes. This allows the system to highlight patterns of incorrect responses, which may indicate areas where students experience learning difficulties or misunderstand key concepts.

	The analyzed results are presented to lecturers in a structured and interpretable format, supporting them in reviewing student learning progress. By examining aggregated response data, lecturers can identify topics that require further explanation, clarification, or instructional support. This enables lecturers to take informed actions, such as revisiting specific concepts, adjusting teaching strategies, or providing targeted guidance to students.

ConceptIdentify is designed as a supplementary learning support tool and does not replace existing Learning Management Systems. Instead, it complements current teaching practices by focusing on question based learning and structured response analysis while maintaining full lecturer control over instructional content and assessment activities.

## **OBJECTIVE OF THE STUDY**

The objective of this project is to develop a learning support system that assists lecturers in identifying which parts of the learning materials students struggle to understand, using AI assisted practice questions as a diagnostic tool and space for students to practice.

The objectives are:

* To identify challenges faced by lecturers in detecting students’ learning gaps using existing assessment practices.

* To determine the system features required for a learning support system that assists lecturers in assessment preparation and organization of learning materials.

* To design and implement a learning support system that supports AI-assisted question generation, lecturer question creation, and student response analysis.

* To evaluate the usability and effectiveness of the proposed system in supporting lecturers’ assessment tasks.

## **STATEMENT OF PROBLEM** 

Despite the benefits of quizzes and question based activities in supporting student recall and understanding, many teachers face practical challenges in using them effectively. Teachers often lack sufficient time to create assessment activities and experience difficulty in identifying which specific topics or concepts students are struggling to understand. These challenges limit teachers’ ability to provide timely and targeted learning support.

In view of these challenges, this study seeks to answer the following questions:

1. What challenges do lecturers face in identifying students’ learning gaps using existing assessment practices?  
2. What system features are required for a learning support system that assists lecturers in generating assessment questions and organizing learning materials?  
3. How can the proposed system support assessment workflows such as AI-assisted question generation, lecturer question creation, and student response analysis?  
4. How usable and effective is the proposed system in supporting lecturers’ assessment and learning gap identification tasks?

## **SCOPE AND LIMITATIONS OF THE STUDY**

The scope of this study involves key stakeholders within an academic teaching and learning environment, specifically lecturers and students. The study begins with problem identification through surveys conducted with lecturers to gather preliminary data. This is followed by an investigation of existing methods used by lecturers to assess student understanding. Based on the findings, system requirements are defined to guide the development of a learning support system aligned with the research objectives.  
The technical scope of the project covers the planning, design, development, and evaluation of a learning support system intended to assist lecturers in assessment related tasks. This includes translating research findings into software requirements, developing the system according to the defined specifications, and conducting quality assurance testing to evaluate functionality, usability, performance, and reliability in accordance with ISO/IEC 25010 guidelines. The project also includes deploying the system in an academic environment for limited use and conducting an evaluation to determine how well the system supports lecturers’ assessment tasks.   
The project has several limitations. The effectiveness of ConceptIdentify depends on the quality and clarity of the learning materials uploaded by lecturers, as unclear materials may affect the relevance of generated questions. Although artificial intelligence is used to assist in question generation, the system does not guarantee that all generated questions are suitable for educationally appropriate, making lecturer review essential. In addition, the system focuses only on text based learning materials and does not support multimedia content such as videos or audio files and does not replace lecturer judgment or existing learning management systems.

## **THEORETICAL FRAMEWORK OF THE STUDY**

To effectively build a system that addresses the problems in assessment creation and learning difficulty identification, it is important to adopt a suitable software development methodology. Extreme Programming (XP) was created for small, co located teams developing software with requirements that are not clearly defined or are subject to frequent changes (Smith & Stoecklin, 2001).

The proposed system fits well with this methodology as the project is developed by a small team and system requirements evolve based on feedback. Extreme Programming consists of five key stages (Sudarsono, 2020):

* **Planning**: Identifying lecturers’ requirements related to assessment creation, practice questions, and learning difficulty identification.  
* **Designing**: Translating requirements into system models, including the organization of learning materials, assessment flow, and analytics structure.  
* **Coding**: Implementing system functionalities such as AI assisted question generation, lecturer approval, student response analysis, and analytics dashboards.  
* **Testing**: Evaluating system functions to ensure that assessments, analytics, and notifications operate as expected.  
* **Release**: Lecturers test the system for acceptance, after which the system is prepared for deployment.

![][image9]

**Figure 9\. The Stages of Extreme Programming In Software Development**

This structured yet flexible approach allows continuous refinement of the system throughout development.

Ensuring a high quality and reliable assessment support system requires structured quality assurance beyond continuous testing in Extreme Programming. The ISO/IEC 25010 software quality model defines eight quality characteristics: functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, and portability (Nyári & Kerti, 2021).

To align with the ISO/IEC 25010 standard, the following quality attributes are assessed during the final quality assurance phase before deployment:

* **Functional Suitability**: Ensuring that core features such as assessment generation, lecturer approval, and learning difficulty identification function as intended.  
* **Performance Efficiency**: Evaluating system responsiveness when processing assessment data and analytics.  
* **Compatibility**: Testing system operation across different browsers and devices used by users.  
* **Usability**: Conducting user testing to ensure clear workflows, intuitive navigation, and ease of use.  
* **Reliability**: Ensuring system stability during repeated usage and preventing unexpected failures.  
* **Security**: Protecting the system from unauthorized access and safeguarding student performance data.

These quality assurance activities ensure that the system meets both functional and non functional requirements prior to deployment.

The success of the proposed system also depends on lecturers’ acceptance and adoption. The Unified Theory of Acceptance and Use of Technology (UTAUT) provides a framework for understanding factors that influence user behavior (Marikyan & Papagiannidis, 2018). According to the UTAUT model, technology adoption is influenced by four key constructs.

**Performance Expectancy** refers to the degree to which lecturers believe that using the system will improve assessment practices and support the identification of student learning difficulties.

**Effort Expectancy** reflects users’ perception of how easy the system is to use, including uploading learning materials, reviewing generated questions, approving assessments, and interpreting analytics results.

**Social Influence** refers to how much lecturers feel that their colleagues or institutional practices encourage them to use the system.

**Facilitating Conditions** refer to the availability of technical infrastructure, devices, internet access, and technical support necessary to use the system effectively.

## **SIGNIFICANCE OF THE STUDY**

This project addresses key challenges faced by lecturers and students, including time consuming quiz creation, difficulty identifying learning gaps, and students’ limited awareness of weak topics and confidence. By supporting structured assessment and analysis of student responses, the project contributes to improved teaching and learning practices.

### **Students**

Students benefit from ConceptIdentify by gaining access to structured assessment questions that help them recognize which topics they do not fully understand. By answering practice questions, students can identify learning gaps during the learning process rather than only after formal examinations. This supports self awareness of learning progress and encourages independent study.

### **Lecturers**

ConceptIdentify helps Lecturers reduce the time required to manually create quizzes while providing topic based information on student performance. This allows lecturers to identify learning difficulties more clearly and explain the misunderstood concepts to students and provide targeted assistance to help them overcome these difficulties.

### **Educational Institutions**

Educational institutions, including Paragon International University, benefit from the project through improved overall student academic performance and teaching quality. By supporting earlier identification of learning issues, the project may reduce student failure rates and low academic performance. In addition, the project strengthens teaching and assessment practices by promoting more effective use of assessment data without requiring changes to existing learning management systems or reducing lecturer control over learning content.

### **Current and Future Researchers**

This study provides a reference for current and future researchers interested in AI assisted assessment and learning support systems. It offers insights into system design, assessment workflows, and the use of student response data to identify learning difficulties, which may support further research and system development in educational technology.

## **DEFINITION OF TERMS**

This section presents the operational and technical terms used in this study to ensure clarity and consistent understanding of key concepts related to the ConceptIdentify system.

**Artificial Intelligence (AI).**  
 The use of machine learning and language models in the system to generate assessment questions and analyze student responses.

**Assessment Question.**  
 A practice question used to evaluate student understanding of a specific topic, including multiple-choice or short open-ended formats.

**ConceptIdentify.**  
 The web-based learning support system developed in this study to assist lecturers in generating assessments and identifying students’ learning difficulties.

**Dashboard.**  
 A visual interface in the system that presents summarized analytics such as topic performance and student progress.

**Embedding Model.**  
 An AI model used to convert text-based learning materials into vector representations for semantic retrieval.

**Learning Gap.**  
 A concept or topic that students have difficulty understanding, identified through repeated incorrect responses.

**Learning Management System (LMS).**  
 An existing educational platform used to distribute course materials and manage assessments, typically without detailed topic-level learning analysis.

**Lecturer Approval.**  
 The process where lecturers review and approve AI-generated questions before they are released to students.

**Student Response Analysis.**  
 The automated process of examining student answers to detect patterns of misunderstanding.

**Topic Tagging.**  
 The assignment of a specific topic label to each assessment question to enable topic-level performance analysis.

**Topic-Level Performance.**  
 A measurement of student accuracy and error rates organized according to specific learning topics.

**User Authentication.**  
 A security process that verifies user identity and restricts system access based on assigned roles such as lecturer or student.

**Weak Topic.**  
 A topic in which students consistently demonstrate low accuracy or frequent incorrect responses.

## **CONCEPTUAL FRAMEWORK OF THE STUDY**

![][image10]

**Figure 10\. Conceptual Framework for ConceptIdentify**

### 

### **Lecturer**

This input represents challenges faced by lecturers:

* Time consuming manual quiz creation: creating quizzes and assessment questions manually is time consuming  
* Difficulty identifying which topic student struggling with: difficulty identifying which topics students struggle to understand based on assessment results

### **Student**

This input represents difficulties faced by students:

* Unable to identify with own weak topic: Students are often unable to identify their own weak topics  
* Lack of confidence: Students that don’t want to participate in the classroom due the lack of understanding and confidence.

**ConceptIdentify**

This section explains what happens inside the system after inputs are received:

* Integration AI assistance: ConceptIdentify generates assessment questions with AI assistance  
* Analyze student responses: ConceptIdentify analyze student responses to identify which topic students struggling with  
* Organize learning materials by topic: ConceptIdentify organize learning materials to generate questions more efficiency 

**Supporting Frameworks**

* Extreme Programming guides the system development process.   
* ISO/IEC 25010 is used for quality assurance before deployment.  
* The UTAUT model is applied to evaluate user acceptance after deployment.

**Output**

The output section represents the results output by the system after processing the inputs.

* Generated question: ConceptIdentify generates assessment questions with AI assistance to help reduce time that take lecturer to do by manual  
* Identification of students’ weak topics: ConceptIdentify analyzes student responses to identify topic level learning difficulties.  
* Topic Level Diagnostic Performance Report: The system generates a structured diagnostic performance report presented through an interactive analytics dashboard. The report provides aggregated assessment data organized by topic and student performance patterns.

### **Lecturer Report Structure** 

1. Topic Overview  
   * Topic name  
   * Total number of questions attempted  
   * Percentage of correct and incorrect responses  
   * Identification of topics with high error rates  
2. Topic Level Performance Summary  
   * Percentage of incorrect responses per topic  
   * Highlighted topics with high error rates  
3. Student Level Topic Breakdown  
   * Student name  
   * Topics with repeated incorrect responses  
   * Frequency of attempts

## **AI Conceptual Framework for ConceptIdentify**

![][image11]

**Figure 11\. ConceptIdentify AI Framework**

### **AI Models Used in the System**

ConceptIdentify employs a multi-component AI framework designed to support both assessment generation and learning performance analysis while maintaining lecturer control over instructional content. The framework integrates semantic retrieval, AI-assisted question generation, and AI-based response analysis to assist lecturers in identifying students’ conceptual learning difficulties.

First, the system uses a semantic embedding model from the Sentence Transformers family (all-MiniLM-L6-v2) to convert text-based learning materials into vector representations. These embeddings allow the system to retrieve relevant content based on topic categories defined by lecturers. By using semantic embeddings, the system ensures that AI operations are grounded in lecturer-provided learning materials, enabling topic-focused retrieval and improving the relevance of generated assessments.

Second, an instruction-tuned Large Language Model accessed through the Google Gemini Flash API is used to generate draft assessment questions based on the retrieved learning content. The model can generate multiple question types, including multiple-choice and open-ended questions, while following lecturer-defined constraints such as topic category, difficulty level, and number of questions. All AI-generated questions are subject to lecturer review and approval before being published for student use.

In addition to supporting question generation, the same language model is also used to analyze student responses submitted through the system. AI-based response analysis helps identify patterns of misunderstanding by examining student answers to both AI-generated and lecturer-created questions. The analysis results are then aggregated according to topic categories to support topic-level performance evaluation and learning gap identification.

By separating semantic retrieval, question generation, and response analysis, the AI framework ensures that AI assistance remains relevant, controllable, and aligned with instructional objectives. This architecture enables ConceptIdentify to assist lecturers not only in preparing assessments but also in interpreting student responses to identify areas where further instructional support may be required.

# **CHAPTER 2**

# **REVIEW OF RELATED LITERATURE AND STUDIES**

This chapter presents related literature and studies relevant to the problems addressed in this research. The discussion is organized according to the Statement of the Problem to establish theoretical and empirical support for the study.

## **Review of Related Literature and Studies for SOP 1**

**Formative Assessment and the Limits of Traditional Assessment** 

Literature on formative assessment highlights that traditional assessment practices do not always provide sufficient information to identify students’ learning gaps. Sadler (1989) explains that students may produce answers that appear correct or acceptable without fully understanding the underlying concepts. As a result, assessment outcomes may fail to reveal specific conceptual misunderstandings, making it difficult for lecturers to diagnose learning gaps based solely on scores or grades. This limitation reduces the effectiveness of assessments as diagnostic tools for identifying where students struggle.

**Teacher Use of Assessment Data to Identify Learning Difficulties** 

Empirical studies support these theoretical concerns by showing that teachers often rely on limited sources of information when identifying learning difficulties. Schmitterer and Brod (2021) found that teachers commonly use test results, classroom observations, and personal judgment to determine student difficulties. However, the study reported that assessment data do not always clearly indicate the source of students’ misunderstandings, leading to uncertainty in identifying specific learning gaps. Relying on outcomes like correct answers instead of students’ reasoning makes accurate diagnosis difficult, particularly when assessments do not probe conceptual understanding.

**Limitations of Current Learning Analytics Tools**

In addition, research on learning analytics supported formative assessment suggests that many existing assessment tools focus primarily on descriptive reporting, such as overall scores and basic measures of student activity, rather than providing diagnostic insights into topic level learning difficulties (Banihashem et al., 2021). As a result, lecturers are often required to manually analyze assessment data to infer students’ learning gaps.

Together, these findings suggest that lecturers face ongoing challenges in identifying students’ learning gaps using existing assessment practices. Both theoretical and empirical evidence indicate that traditional assessments, combined with limited diagnostic support from current tools, make it difficult to determine which specific concepts students do not understand (Sadler, 1989; Schmitterer & Brod, 2021; Banihashem et al., 2021).

## **Review of Related Literature and Studies for SOP 2**

**Teacher Workload and Time Pressure**

Literature on teaching workload indicates that time constraints significantly influence how lecturers allocate effort across instructional tasks. Studies on teacher workload show that heavy demands related to lesson preparation, assessment, and administrative responsibilities reduce the time available for in depth instructional activities (Wang et al., 2025). When workload increases, lecturers are often required to prioritize essential teaching tasks, which may limit the frequency and depth of assessment activities designed to evaluate student understanding. As a result, time pressure can affect the quality and purpose of assessment practices.

**Assessment Literacy and Assessment Design Challenges**

Research on assessment practices in higher education further indicates that designing effective assessments requires substantial effort, knowledge and skills in designing. Gaikwad et al. (2023) reported that lecturers often face challenges in developing assessments that accurately evaluate student understanding, as assessment design involves aligning learning outcomes and question structures. The study highlighted that limited time and insufficient support can restrict lecturers’ ability to create well designed assessments, which may affect the diagnostic value of assessment activities.

**Automated Question Generation and Time Efficiency**

Empirical studies provide direct evidence of the time burden associated with manual question preparation. Bhowmick et al. (2023) investigated automated question generation in educational contexts and reported that teachers spend a considerable amount of time creating quizzes and question based activities. The study found that manual question preparation demands significant effort and time, which limits how frequently teachers can design diagnostic assessments. Due to these time constraints, assessment practices often focus on final examinations instead of ongoing learning feedback (Bhowmick et al., 2023).

The reviewed literature and studies indicate that the time required to manually prepare question based assessments has a significant impact on lecturers’ assessment practices. Teaching workload and time pressure limit lecturers’ capacity to design frequent and concept focused assessments. Empirical evidence shows that manual question preparation requires significant time and effort, leading lecturers to rely on fewer or less diagnostic assessment activities. These findings directly address SOP 2 and highlight the need for approaches that support more efficient assessment preparation while maintaining the ability to evaluate student understanding effectively.

## **Review of Related Literature and Studies for SOP 3**

**Psychological Factors Affecting Student Participation**

Student participation in classroom discussions is widely recognized as an important component of effective learning; however, research indicates that participation is influenced by a range of psychological, social, and contextual factors. Studies in higher education suggest that students may hesitate to ask questions or contribute to discussions due to fear of making mistakes, lack of confidence in their understanding, and anxiety about negative evaluation from peers or instructors (Khan et al., 2025). These factors often result in classroom silence, even when students experience confusion or difficulty with lesson content.

Empirical evidence further demonstrates that low participation is not necessarily related to a lack of interest or effort. Khan et al. (2025), in a qualitative study of undergraduate students, found that fear of giving incorrect answers, low self confidence, and anxiety were among the most common reasons for students’ unwillingness to participate in class. The study also reported that some students choose to remain silent despite not fully understanding the lesson, indicating that silence does not mean understanding.

**Cultural and Social Influences on Classroom Silence**

Research on classroom silence provides additional insight into how cultural and social dynamics shape participation behavior. Le (2024) examined engineering students in Malaysian and Vietnamese higher education contexts and found that students often avoid speaking during class discussions due to fear of embarrassment, and concern about losing face in front of lecturers and peers. The study emphasized that silence may function as a protective behavior rather than a sign of understanding, limiting instructors’ ability to identify learning difficulties through verbal classroom interaction alone.

### **Instructor and Student Perception Gap**

Supporting evidence from studies examining perspectives of both students and faculty further highlights participation challenges in university settings. Khan et al. (2021) reported that students often perceive classroom discussions as high risk environments where mistakes may be publicly exposed, while instructors may misinterpret silence as engagement or understanding. This mismatch between student behavior and instructor interpretation can reduce opportunities for identifying learning difficulties, particularly in large or formal classroom environments.

The reviewed literature and studies indicate that multiple factors prevent students from participating actively in class discussions. Psychological barriers such as fear of making mistakes, low confidence, and anxiety discourage students from asking questions or expressing confusion (Khan et al., 2025). Cultural and social factors further reinforce classroom silence, particularly in authority driven learning environments where students are unwilling to speak openly (Le, 2024). In addition, differences between student and lecturers’ views of classroom participation lead to misunderstanding of silence as understanding (Khan et al., 2021). Collectively, these findings demonstrate that classroom participation alone is an unreliable indicator of student understanding, directly addressing SOP 3\.

## **Review of Related Literature and Studies for SOP 4**

### **Learning Analytics for Identifying Learning Difficulties**

Studies on learning support systems and learning analytics describe several mechanisms through which such systems assist lecturers in instructional decision making. Learning support systems typically operate by collecting and organizing learner data generated through assessments and learning activities, then applying analytical methods to transform this data into interpretable information for instructors (Hernández de Menéndez et al., 2022). Rather than relying solely on raw scores, these systems structure learning data in ways that allow lecturers to observe patterns, trends, and inconsistencies related to student understanding.

### **Topic Level Performance Analysis**

Research indicates that learning analytics systems assist lecturers in identifying learning difficulties by analyzing student responses across assessments and aggregating results at different levels of granularity. Banihashem et al. (2025) reported that learning analytics tools commonly support formative assessment by grouping student performance data according to learning objectives or topics, enabling instructors to detect areas where students consistently struggle. Through visualizations such as dashboards and summary reports, lecturers are able to interpret learning trends more efficiently than through manual review of individual responses. This approach allows learning difficulties to be identified based on response patterns rather than individual test or quiz results.

**Automated Question Generation and Time Efficiency**

Studies also describe how learning support systems contribute to assessment efficiency by reducing manual effort in assessment preparation. Research on automated assessment tools shows that systems can support lecturers by generating assessment items from existing learning materials and organizing them according to predefined learning objectives. Bhowmick et al. (2023) demonstrated that automated question generation systems reduce the time required for manual quiz creation, enabling lecturers to prepare assessments more frequently without increasing workload. By embedding assessment preparation within a system supported workflow, lecturers can allocate more time to interpreting results rather than constructing assessment content.

In addition, studies highlight that learning support systems assist lecturers by integrating assessment creation and response analysis within a single environment. Hernández de Menéndez et al. (2022) noted that when assessment data and analytical tools are provided within the same system, lecturers are better supported in monitoring learning progress and modifying their teaching strategies. However, several studies also report limitations in current systems. Learning analytics platforms often emphasize descriptive reporting, requiring lecturers to interpret results manually to determine the underlying causes of learning difficulties (Banihashem et al., 2025). This indicates that while systems support efficiency and organization, diagnostic interpretation is not always fully automated.

The reviewed literature and studies show that learning support systems assist lecturers through structured data analysis, aggregation of assessment results, and system supported assessment workflows. Studies describe how learning analytics tools enable identification of learning difficulties by analyzing response patterns at the topic level, while automated assessment technologies reduce the time required for manual assessment preparation. At the same time, existing systems often rely on descriptive analytics and still require lecturer interpretation to fully understand learning difficulties. These findings address SOP 4 by explaining how learning support systems assist lecturers and by highlighting the need for more integrated approaches that combine assessment preparation efficiency with topic level learning difficulty identification.

# **CHAPTER 3**

# **METHODOLOGY**

This chapter presents the study design, data collection procedures, research environment, and requirement specifications of the proposed system. It explains how quantitative and qualitative methods were used to examine assessment challenges and guide the development of ConceptIdentify. The chapter also discusses feasibility analyses, system design, development, and testing procedures.

## **Study Design**

	This study adopted a mixed-method research design integrating both quantitative and qualitative approaches to investigate the assessment challenges outlined in the Statement of Problem (SOP 1–4). Data collection was conducted in two phases to ensure system requirements were grounded in both measurable patterns and experiential insights.

### **Methodology for SOP 1**

SOP 1 aimed to identify the challenges lecturers face in detecting students’ learning gaps using existing assessment practices. To investigate this objective, quantitative data were collected through structured surveys administered to lecturers and undergraduate students. The lecturer survey examined current assessment practices, difficulties in identifying topic-level misunderstandings, and time-related constraints in analyzing student responses. The student survey focused on classroom participation behavior, awareness of weak topics, and hesitation in asking questions during lessons.

The survey instrument consisted of multiple-choice and Likert-scale questions designed to identify measurable patterns related to assessment limitations and student learning behaviors. The collected responses provided statistical insights into common instructional challenges and limitations of existing assessment approaches.

To complement the quantitative data, semi-structured interviews were conducted with one lecturer and one student. These interviews provided deeper explanations about current assessment workflows, challenges in identifying conceptual misunderstandings, and factors influencing student participation. Combining survey results and interview responses allowed the study to capture both measurable trends and real user experiences related to the identified challenges.

### **Methodology for SOP 2**

SOP 2 aimed to determine the system features required for a learning support system that assists lecturers in assessment preparation and organization of learning materials. The identification of system features was guided by the findings obtained from the surveys and interviews conducted in SOP 1\.

Survey responses were analyzed to identify recurring problems related to assessment preparation, manual response analysis, and limited diagnostic feedback from existing practices. In addition, interview responses provided further insights into lecturers’ expectations for tools that could assist in identifying learning difficulties and reducing assessment preparation time.

Based on these findings, system requirements were derived and translated into functional modules and system features, including AI-assisted question generation, lecturer question creation, topic tagging, and automated student response analysis.

### **Methodology for SOP 3**

SOP 3 focused on the design and development of the proposed learning support system. The system was developed using the Extreme Programming (XP) software development methodology, which supports iterative development and continuous refinement of system features.

The development process followed the stages of planning, design, coding, testing, and release. During the planning stage, system requirements identified in SOP 2 were translated into functional specifications. The design stage involved developing system models such as the Functional Decomposition Diagram and system architecture. Coding involved implementing the system using the selected technologies, including Django, PostgreSQL, and AI integration components. Testing activities were conducted throughout development to ensure that system functionalities operated correctly and met the specified requirements.

### **Methodology for SOP 4**

SOP 4 aimed to evaluate the usability and effectiveness of the proposed system in supporting lecturers’ assessment tasks. The evaluation was conducted based on selected quality characteristics from the ISO/IEC 25010 software quality model, particularly usability, functional suitability, and performance efficiency.

User evaluation was conducted with lecturers and students who interacted with the system during the testing phase. Participants were asked to perform typical system tasks such as accessing learning materials, answering assessment questions, and reviewing analytics results. Feedback was collected to assess system usability, clarity of interface design, and usefulness of the generated diagnostic information.

The evaluation results were used to determine whether the system effectively supports assessment preparation, response analysis, and identification of students’ weak topics.

## **ENVIRONMENT**

* **Locale:** This study was conducted at Paragon International University, located in Phnom Penh, Cambodia. The university was selected as the research setting because it provides a structured higher education environment where lecturers regularly conduct assessments and students participate in classroom based learning activities. This setting is appropriate for examining assessment practices and identifying challenges related to students’ conceptual understanding.  
* **Population of Study:** The population of this study consists of undergraduate students and lecturers from multiple academic departments at Paragon International University.

**Table 1\.**   
**Distribution of Lecturer Respondents by Department**

| Department / Program | Number of Lecturers |
| :---- | :---- |
| Computer Science | 9 |
| Business and Accounting | 2 |
| Foundation / General Studies | 2 |
| Civil Engineering | 1 |
| Law | 1 |
| Total | 15 |
|  |  |

	

**Table 2\.**   
**Distribution of Student Respondents by Department**

| Department | Number of Students |
| :---- | :---- |
| Computer Science | 27 |
| Management Information Systems | 1 |
| Business and Accounting | 5 |
| Mathematics | 1 |
| Civil Engineering | 1 |
| Total | 35 |

This study employed purposive sampling to collect data from participants directly involved in teaching and learning activities. Lecturers who regularly conduct assessments and undergraduate students who participate in classroom based instruction were selected as respondents.

A total of 15 lecturers participated in the survey, representing approximately half of the active teaching staff at the time of data collection. This proportion provides a reasonable overview of instructional assessment practices across departments.

For students, 35 undergraduate respondents participated in the survey. Although this number is small compared to the total student population, this study is exploratory in nature. The goal of the survey was not to represent all students statistically, but to identify common patterns in classroom participation, confidence levels, and awareness of topic-level learning difficulties.

The purpose of collecting this data was to understand recurring problems that could guide the design of the proposed system. Therefore, the sample size is considered sufficient for identifying key issues and informing system development.

## 

**Organizational Chart/Profile**

**![][image12]**

**Figure 12\. Organizational Chart**

Figure 12 illustrates the academic structure relevant to the operational workflow of the ConceptIdentify system.

Within the university environment, lecturers are responsible for managing individual classes and conducting assessments. Each lecturer handles one or more classes, and students are enrolled in these classes according to their academic registration.

The system is structured around this direct instructional relationship between lecturers and students. Lecturers manage classes within the system, upload learning materials, and prepare assessments. Students enroll in classes and participate in learning activities and practice assessments under their respective lecturers.

## **Data Collection Procedure and Ethical Protocol**

Data collection for this study was conducted in two phases: survey distribution and semi structured interviews.

For the quantitative phase, structured questionnaires were developed using Google Forms and distributed to lecturers and undergraduate students at Paragon International University. The survey link was shared through institutional communication channels, including academic group messaging platforms and direct communication with lecturers. Participation was voluntary, and respondents were informed that the survey was conducted solely for academic research purposes. The survey was open from January 16, 2026 to February 25, 2026 to allow sufficient time for participant responses.

No personal information was required for analysis. Although optional identifiers were initially available for follow up clarification, responses used for analysis were treated anonymously. All collected survey data were automatically recorded within the secure Google Forms platform and later exported for analysis.

For the qualitative phase, one lecturer and one student were selected using purposive sampling to provide in depth insights into assessment practices and classroom learning experiences. Interviews were conducted face to face and lasted approximately 10 to 20 minutes. Prior to the interview, participants were informed about the purpose of the research, and verbal consent was obtained for audio recording. Recordings were transcribed manually by the researcher to ensure accuracy.

## To maintain data integrity and confidentiality, all digital files, including survey exports and interview transcripts, were stored on a password protected personal device accessible only to the researcher. The collected data were used strictly for academic purposes and were not shared publicly. These procedures ensured ethical compliance, voluntary participation, and reliability of the research findings.

## **REQUIREMENT SPECIFICATIONS**

### **Operational Feasibility**

#### **Fishbone Diagram**

![][image13]  
**Figure 13\. Fishbone Diagram**

### **Process Factors**

Assessment results are typically interpreted based on total scores rather than broken down by topic. Without systematic topic level analysis, instructors must manually review student responses to identify repeated mistakes. This manual process is time consuming and often results in delayed feedback, reducing the effectiveness of corrective intervention.

### **Lecturer Factors**

Instructors manage multiple responsibilities, including lesson preparation, grading, and administrative duties. Manual grading and limited time restrict the ability to conduct detailed performance analysis. As a result, evaluation may rely on professional intuition rather than structured analytical evidence, making it difficult to find common conceptual mistakes.

### **Technology Limitations**

Existing digital systems primarily record overall grades without providing automated topic level performance analysis or structured diagnostic reporting. The lack of built in analytical tools requires instructors to interpret assessment data manually, which reduces consistency in identifying  common conceptual mistakes.

### **Student Factors**

Low classroom participation and hesitation to ask questions may conceal misunderstandings during instruction. When misconceptions are not expressed openly, assessments become the primary source of evidence. However, without structured topic based analysis, these hidden weaknesses may remain undetected.

#### **Functional Decomposition Diagram**

![][image14]  
**Figure 14\. Functional Decomposition Diagram**

The FDD presents the hierarchical breakdown of the ConceptIdentify System into major functional modules and sub functions. The system is structured into five primary components: User Management, Content & AI Assessment Management, Student Practice Module, Performance Analysis & Reporting, and Dashboard & Visualization.

User Management handles authentication and role based access control to ensure secure system usage. The Content & AI Assessment Management module supports the upload of learning materials, topic categorization, AI assisted question generation, and lecturer approval workflow. The Student Practice Module enables students to access approved practice questions and submit responses.

The Performance Analysis & Reporting module processes response data to compute topic level error rates, detect learning gaps, and generate structured diagnostic reports at both individual and class levels. Finally, the Dashboard & Visualization module presents analytical results through interactive dashboards and visual indicators for both lecturers and students.

The diagram demonstrates how the system functions collectively to automate topic level performance analysis and provide structured reporting, directly addressing the identified assessment limitations.

### **FR01.1 Registration**

* The system shall allow students to register using institutional email credentials.  
* The system shall allow lecturers to register using authorized institutional credentials.  
* The system shall validate user input before account creation.  
* The system shall prevent duplicate account registration.

### **FR01.2 Authentication**

* The system shall authenticate users using registered credentials.  
* The system shall reject invalid login attempts.  
* The system shall maintain secure login sessions.  
* The system shall allow users to log out securely.

### **FR01.3 Role Based Access Control**

* The system shall assign users either Lecturer or Student roles.  
* The system shall restrict system functionalities based on role.  
* Students shall not access content management or analytics modules.  
* Lecturers shall access content management, analytics, and reporting features.

### **FR01.4 Profile Management**

* Users shall update basic profile information.  
* Users shall modify passwords securely.

### **FR02.1 Learning Material Upload**

* The system shall allow lecturers to upload text based learning materials (PDF or text).  
* The system shall associate uploaded materials with a selected course.

### **FR02.2 Topic Categorization**

* The system shall allow lecturers to define topic or subtopic categories for each course.  
* The system shall store topic identifiers for later performance mapping.

### **FR02.3 AI Assisted Question Generation**

* The system shall extract relevant content from uploaded materials.  
* The system shall generate draft practice questions aligned with defined topics.  
* The system shall support multiple choice questions (MCQ).  
* The system shall support open-ended short answer questions.  
* The system shall associate each generated question with a topic category.

### **FR02.4 Lecturer Review & Approval**

* The system shall allow lecturers to review generated questions.  
* The system shall allow editing or deleting generated questions.  
* The system shall prevent unapproved questions from being visible to students.  
* The system shall allow lecturers to publish approved questions to students.

### **FR02.5 Lecturer Question Creation**

* The system shall allow lecturers to manually create assessment questions.  
* The system shall allow lecturers to select the question type (MCQ or open-ended).  
* The system shall allow lecturers to associate questions with a specific topic.  
* The system shall store lecturer-created questions in the assessment database.  
* The system shall require lecturers to assign a topic tag to each assessment question.  
* The system shall allow lecturers to select the topic from predefined topic categories.  
* The system shall store the topic tag to enable topic-level performance analysis.  
* The system shall prevent publishing a question if no topic tag is assigned.

### **FR03.1 Question Access**

* The system shall allow students to access only approved questions.  
* The system shall restrict access to questions belonging to enrolled courses.

### **FR03.2 Response Submission**

* The system shall allow students to submit answers to questions.  
* The system shall record responses per question.  
* The system shall link each response to its associated topic.

### **FR03.3 Immediate Feedback**

* The system shall provide immediate correctness feedback.  
* The system shall indicate correct or incorrect responses after submission.

### **FR04.1 Topic Level Aggregation**

* The system shall group student responses by topic category.  
* The system shall compute total attempts per topic.

### **FR04.2 Accuracy Calculation**

* The system shall calculate topic level accuracy percentage for each student.  
* The system shall calculate topic level accuracy percentage for the class.

### **FR04.3 Learning Gap Identification**

* The system shall identify topics with lower accuracy compared to others.  
* The system shall highlight topics with repeated incorrect responses.

### **FR04.4 Diagnostic Report Generation**

* The system shall generate individual topic level performance summaries.  
* The system shall generate class level topic mastery summaries.  
* The system shall allow report export in structured digital format.

### **FR05.1 Lecturer Dashboard**

* The system shall display class level topic performance overview.  
* The system shall highlight weak topics using visual indicators.  
* The system shall allow selection of individual students to view topic performance.  
* The system shall display topic level accuracy distribution charts.

### **FR05.2 Student Dashboard**

* The system shall display individual topic level performance summary.  
* The system shall highlight weak topics for review.  
* The system shall display overall accuracy and attempt history.

### **FR05.3 Visualization Features**

* The system shall present topic performance using charts or graphical indicators.  
* The system shall use visual indicators to show different mastery levels.

### **Technical Feasibility**

#### **Compatibility Checking**

+ **Hardware compatibility**

The system is web based and does not require high end hardware on the client side.

Minimum Client Requirements:

* Device Type: Desktop, Laptop, or Tablet  
* Processor: Dual core 1.6 GHz or higher  
* RAM: Minimum 4 GB  
* Screen Resolutions: 1024 × 768, 1366 × 768, 1920 × 1080  
* Storage: 200 MB available space  
* Internet Connection: Stable broadband connection

The interface layout is designed using responsive web components to ensure proper display across common laptop and desktop screen sizes typically used in academic settings. Most devices currently used by lecturers and students at the university meet or exceed these specifications, making the system technically deployable without additional hardware investment.

+ **Software compatibility**

The system is accessible through modern web browsers and does not require additional software installation.

Supported Browsers:

* Google Chrome  
* Microsoft Edge   
* Mozilla Firefox

Because the system runs entirely within a browser environment, it ensures platform independence and ease of access for both lecturers and students.

#### **Relevance of the Technologies**

**Table 3\.** 

**Relevance of the Technologies used in ConceptIdentify**

| Category | Technology | Purpose / Relevance |
| :---- | :---- | :---- |
| Backend Framework | Django 4.2 | Provides built in authentication, ORM, and secure web application development. Enables rapid development and structured data handling. |
| Programming Language | Python 3.10 | Supports AI integration, natural language processing, and seamless connection with embedding models and AI APIs. |
| Database Management System | PostgreSQL 14 | Stores structured data such as users, questions, responses, and performance analytics with reliability and scalability. |
| AI Embedding Model | Sentence  Transformers (all MiniLM L6 v2) | Converts learning materials into semantic vector representations for topic based retrieval and analysis. |
| AI Generation API | Google Gemini Flash API | Generates draft assessment questions based on retrieved learning content. |
| Frontend Framework | Bootstrap 5.3 | Ensures a responsive layout and consistent user interface components across desktop, laptop, and tablet screens. |
| Data Visualization | Chart.js 4.0 | Generates graphical representation of topic level performance and diagnostic analytics. |
| Server Environment | Linux (Ubuntu Server 22.04) | Provides stable and secure deployment environment compatible with Django and PostgreSQL. |

	

The deployment environment uses Ubuntu Server 22.04 LTS, which provides a stable operating system for backend services. The application is developed using Python 3.10 and Django 4.2 LTS, which are fully compatible and widely supported for web application development. PostgreSQL 14 is used as the relational database, integrating seamlessly with Django’s Object Relational Mapping (ORM) system to manage structured application data.

For the artificial intelligence components, the Sentence-Transformers library and PyTorch framework are supported in the Python environment, enabling the system to perform semantic embedding locally. In addition, the Google Gemini API is accessed through the official Google Generative AI SDK for question generation. On the frontend, Bootstrap 5.3 and Chart.js 4.0 are used to create responsive user interfaces and visual analytics dashboards, integrating smoothly with Django’s template rendering system.

### **Schedule Feasibility**

#### **Gantt Chart**

**Table 4\.** 

**Gantt Chart of FYP 1**

![][image15]

	

### **Table 5\.** 

### **Gantt Chart of FYP 2**

![][image16]

### **Table 6\.** 

### **Gantt Chart of Development Phase**	

### **![][image17]**

	

### **Economic Feasibility**

#### **Cost Benefits Analysis**

**Table 7\.** 

**Cost Benefits Analysis**

| Item | Vendor | Specifications | Total Price (per year) | Actual Price | Benefit |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Development** | ConceptIdentify Developer | 60 mandays of software design, development, and implementation assuming 1 manday is 6 to 8 hours. | $6,000 ($100 per manday) | $0 | The system is developed by a senior student at Paragon International University. |
| **AI Embedding Model** | Hugging Face (Open Source) | Sentence Transformers (all MiniLM L6 v2). Self hosted on the deployment server. | $0 | $0 | Converts text based learning materials into vector representations to allow for efficient, topic based semantic retrieval. |
| **AI Generation API** | Google Cloud (Gemini API) | Google Gemini Flash API. Free tier for development (up to 15 RPM). | $0 | $0 | Provides the core Large Language Model capabilities required to generate draft practice questions from lecturer materials. |
| **Development Server** | Digital Ocean  | Frontend, Backend and Database (24$ / month) | $288 | 288 | Hosts the Django application, PostgreSQL database, and embedding model within a cloud based virtual server environment during development and pilot deployment. |
| **Domain Name** | Namecheap | Domain Only | $1.18 | $1.18 | For domain name registration, we refer to the Namecheap as our provider for both development and deployment. |
| **Domain Security** | Cloudflare | End to end encryption  | $0 | $0 | Cloudflare is utilized for domain security to help prevent cyber attacks and manage DNS routing securely. |

	

**Table 7** illustrates the cost and benefit analysis of ConceptIdentify, detailing the specific expenses required to successfully develop and host this project. For the first item, which relates to the product's actual development, the cost is mitigated because the research and programming will be conducted by the researcher themselves. The estimated market equivalent development cost is calculated at **$6,000** (60 man days at $100 per man day, the daily development rate of $100 per man day is estimated based on average software development rates). However, since the system is developed by the researcher as part of academic requirements, the actual money that has been spent by the institution is $0.

Additionally, the deployment section of the cost and benefit analysis reflects the use of a cloud based hosting solution through DigitalOcean. The selected configuration includes a virtual server with 4 GB RAM and 2 vCPUs, sufficient to host the Django backend, PostgreSQL database, and self hosted embedding model. The annual hosting cost is estimated at $288 ($24 per month). This cloud deployment ensures scalability, reliability, and controlled resource allocation for development and pilot deployment phases.

Furthermore, the system utilizes a two part artificial intelligence framework. The first component, the Sentence Transformers (all MiniLM L6 v2) embedding model, is an open source technology accessed via Hugging Face. Because it is lightweight and self hosted directly on the server, it incurs no external API costs. The second component, the Google Gemini Flash API used for question generation, operates on the developer free tier. By leveraging open source embedding models and free tier generation APIs during the research phase, the project avoids the high costs typically associated with enterprise AI tools, keeping the operational AI budget at **$0,** While the system currently operates within the free tier limits of the AI API during research and pilot deployment, additional usage costs may apply if institutional adoption scales significantly.

Regarding the domain name, the system utilizes a registered domain obtained through Namecheap at an annual cost of $1.18. Cloudflare’s free tier DNS and security services are used to provide SSL encryption and basic protection against cyber threats.

#### **Cost Recovery Scheme**

Because ConceptIdentify is developed as an internal academic support tool for the Faculty of Information and Computer Technology at Paragon International University, the system does not employ a commercial monetization strategy, such as user subscriptions or licensing fees. Therefore, the cost recovery is not measured in direct financial profit, but rather in the operational sustainability and the long term efficiency gained by the institution.

To demonstrate the financial sustainability of the system after deployment, a five year maintenance projection is established.

**Table 8\.** 

**Maintenance Cost**

| Expense Category | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Total |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Server & Domain Hosting** | $289 | $289 | $289 | $289 | $289 | $1,446 |
| **AI API Usage (Free Tiers)** | $0 | $0 | $0 | $0 | $0 | $0 |
| **System Maintenance / Contingency** | $50 | $50 | $50 | $50 | $50 | $250 |
| **Total** | $339 | $339 | $339 | $339 | $339 | $1,696 |

**Table 8** illustrates the projected maintenance costs required to keep the ConceptIdentify system operational over a five year lifecycle. The system is deployed on a cloud based hosting environment (DigitalOcean), with an annual server cost of $288 and domain registration cost of $1.18, totaling $289.18 per year. The AI embedding model is open source and self hosted, while the Gemini API operates under a developer free tier during the research and pilot phase. Although AI usage currently incurs no cost, additional charges may apply if usage exceeds free tier limits during large scale institutional deployment.

A nominal contingency allocation of $50 per year is included to account for minor system updates, security patches, and potential API overages.

**Return on Investment (ROI)** The return on investment for ConceptIdentify is realized through institutional efficiency rather than direct financial profit. Based on preliminary survey and interview findings, lecturers reported spending significant time manually reviewing assessment responses to identify topic level learning gaps, often resulting in repetitive explanations or re teaching of entire topics due to limited diagnostic clarity.

By automating the generation of practice questions and providing an instant topic level diagnostic dashboard, ConceptIdentify reduces the need for manual response analysis and enables more targeted instructional intervention. Even a conservative reduction of approximately 4 to 6 hours per semester per lecturer in assessment review and analysis can result in meaningful time savings.

Assuming a modest instructional valuation of $15 to $20 per hour, the estimated value of time saved per lecturer could range between $60 and $120 per semester. When aggregated across multiple lecturers and academic terms, these efficiency gains significantly exceed the estimated annual operational cost of approximately $339.

Therefore, although the system does not generate direct monetary profit, its institutional value is reflected in reduced instructional workload, improved assessment efficiency, and enhanced teaching effectiveness. From an economic perspective, the projected operational costs are justified by the measurable time savings and productivity improvements, demonstrating strong financial sustainability for long term institutional adoption.

### 3.2.5 Requirements Modeling

#### Input-Process-Output

![][image18]

![][image19]

![][image20]

![][image21]

![][image22]

![][image23]

![][image24]

![][image25]

![][image26]

![][image27]

![][image28]

![][image29]

![][image30]

![][image31]

![][image32]

![][image33]

#### Performance Modeling

![][image34]

![][image35]

#### Control

#### Data and Process Modelling

![][image36]

#### Object Modeling

![][image37]

### 3.2.6 Risk Assessment/Analysis

| Category / Functionality | Identified Risk | Impact Level | Mitigation / Contingency Strategy |
| :---- | :---- | :---- | :---- |
| Operational (AI Integration) | AI Hallucination / Inaccuracy: The Gemini API generates factually incorrect or irrelevant practice questions. | High | Implement a mandatory "Human-in-the-Loop" workflow. All AI-generated questions are saved as drafts and require explicit lecturer review and approval before publishing. |
| Technical (AI Pipeline) | Vector Search Failure: Semantic search returns irrelevant context, leading to poor question generation. | Medium | Optimize the text-chunking algorithm during the PDF upload phase and refine the Sentence-Transformers embedding strategy to ensure high semantic accuracy. |
| Financial (Cloud APIs) | API Cost Overruns: High volume of generation requests exceeds the free tier or incurs massive token costs. | Medium | Implement strict file-size limits for uploads, optimize prompt token length, and utilize the cost-effective Gemini 1.5 Flash tier. |
| Technical (System Performance) | Generation Timeout: The server experiences slow response times while waiting for the Gemini API, causing the UI to freeze. | Medium | Utilize asynchronous processing (async/await) in the Django backend and implement front-end loading states/spinners to maintain UX. |
| Security (Data Integrity) | Data Loss: Server crash or database corruption results in the loss of student grades or class materials. | High | Configure automated, scheduled database backups using PostgreSQL and DigitalOcean snapshot features. |
| Security (Access Control) | Unauthorized Access: Students bypass UI restrictions to view lecturer dashboards or other students' grades. | High | Enforce strict Role-Based Access Control (RBAC) via backend middleware to validate JSON Web Tokens (JWT) or session cookies on every endpoint. |
| Security (File Storage) | Corrupted/Malicious Uploads: Users upload unsupported, excessively large, or malicious files. | Low | Implement strict server-side validation to accept only .pdf and .txt formats and enforce a strict megabyte limit prior to processing. |

## 3.3 DESIGN

### 3.3.1 User Interface Design

![][image38]

![][image39]

![][image40]

![][image41]

![][image42]

![][image43]

![][image44]

![][image45]

![][image46]

![][image47]

![][image48]

![][image49]

![][image50]

![][image51]

![][image52]

![][image53]

![][image54]

![][image55]

![][image56]

### 3.3.2 Data Design

#### Entity Relationship Diagram

![][image57]

#### Data Dictionary

| user |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique identifier for the user |
| username | Varchar(150) |  | Login username |
| email | Varchar(254) |  | Login email |
| password | Varchar(128) |  | Encrypted password |
| first\_name | Varchar(150) |  | User’s first name (display only) |
| last\_name | Varchar(150) |  | User’s last name (display only) |
| role | Varchar(10) |  | student or lecturer |
| is\_approved | Boolean |  | Lecturer approval status |
| created\_at | Datetime |  | Account creation timestamp |
| updated\_at | Datetime |  | Last update timestamp |

| enrollment |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique enrollment ID |
| joined\_at | Datetime |  | Timestamp when student joins the course |
| course\_id | Integer | FK → courses\_course.id | Course the student joined |
| student\_id | Integer | FK → users\_user.id | Student user ID |

| material |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique material ID |
| topic\_id | Integer | FK → topics\_topic.id | Topic this material belongs to |
| title | Varchar(255) |  | Material title |
| content | Text |  | Material text content |
| uploaded\_at | Datetime |  | Upload timestamp |

| choice |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique choice ID |
| question\_id | Integer | FK → assessments\_question.id | Question this choice belongs to |
| text | Varchar(255) |  | Choice text |
| is\_correct | Boolean |  | Indicates if this choice is correct |

| course |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique identifier for the course |
| name | Varchar(255) |  | Course name |
| description | Text |  | Course description |
| join\_code | Varchar(10) |  | Unique code used by students to join the course |
| created\_at | Datetime |  | Timestamp when course is created |
| lecturer\_id | Integer | FK → users\_user.id | Lecturer who created the course |

| topic |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique topic ID |
| name | Varchar(255) |  | Topic name |
| description | Text |  | Topic description |
| course\_id | Integer | FK → courses\_course.id | Course this topic belongs to |

| question |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique question ID |
| topic\_id | Integer | FK → topics\_topic.id | Topic this question belongs to |
| text | Text |  | Question text |
| question\_type | Varchar(10) |  | Question type (mcq or open) |
| created\_by | Varchar(10) |  | lecturer or ai |
| correct\_answer | Text |  | Correct answer (for open-ended) |
| is\_approved | Boolean |  | Question approval status |
| created\_at | Datetime |  | Creation timestamp |

| studentresponse |  |  |  |
| ----- | ----- | ----- | ----- |
| **Column Name** | **Data Type** | **PK/FK** | **Description** |
| id | Integer | PK | Unique response ID |
| student\_id | Integer | FK → users\_user.id | Student who submitted the answer |
| question\_id | Integer | FK → assessments\_question.id | Question answered |
| answer | Text |  | Student’s submitted answer |
| score | Float |  | Score given by AI evaluation |
| feedback | Text |  | Feedback text from AI evaluation |
| created\_at | Datetime |  | Submission timestamp |

### 3.3.3 System Architecture

#### Network Model

![][image58]

#### Network Topology

![][image59]

#### Security

![][image60]

## 3.4 DEVELOPMENT

### 3.4.1 Software Specification

### 3.4.2 Hardware Specification

### 3.4.3 Program Specification

### 3.4.4 Programming Environment

### 3.4.5 Deployment Diagram

![][image61]

### 3.4.6 Test Plan

| User Type | Main Epic | Module / Feature | Epic User Story | Acceptance Criteria |
| :---- | :---- | :---- | :---- | :---- |
| Any User | Authentication | User Registration | As a user, I want to self-register an account in the system so that I can access the platform. | • Display registration form. • Account is created when required fields are filled. • If role is "Lecturer," set account status to "Pending Approval." |
|  |  | Login / Logout | As a user, I want to securely log in and out of the system. | • User enters credentials and clicks "Login." • System redirects to appropriate dashboard. • User clicks "Logout," session ends, and redirects to login page. |
|  |  | Google OAuth | As a user, I want to log in using my Google account for faster access. | • Display "Login with Google" button. • System seamlessly authenticates via Google. • Existing accounts link automatically via email. |
| Admin | User Management | View Pending Requests | As an admin, I want to view unapproved lecturer accounts. | • Display a list of "Pending" lecturer accounts in the Admin dashboard. |
|  |  | Approve / Reject Lecturers | As an admin, I want to grant or deny lecturer access to the platform. | • Admin clicks "Approve" or "Reject." • System updates the lecturer's status. • System sends an email notification to the lecturer. |
| Lecturer | Class Management | Create Class | As a lecturer, I want to create a class to organize my students and materials. | • Display "Create Class" form. • Lecturer inputs class name and description. • System generates and displays a unique Class Code. |
|  | Topic Management | Create Topic | As a lecturer, I want to create a topic inside class. | • Display "Create Topic" form. • Lecturer inputs Topic name and upload material. |
|  | Content Management | Upload Learning Materials | As a lecturer, I want to upload PDFs/DOCX files for AI processing. | • Display file upload interface. • File is uploaded and stored under the specific class. • File is queued for AI embedding. |
|  | AI Assessment Pipeline | AI Question Generation | As a lecturer, I want to generate quiz questions from uploaded materials. | • Lecturer selects topic and clicks "Generate Question" • System communicates with AI API and returns draft questions. • Questions that are selected and approved will send to student question bank. |
|  |  | Review Generated Questions | As a lecturer, I want to edit, approve, or reject AI-generated questions. | • Display draft questions in an editable format. • Lecturer can modify text or choices. • Clicking "Approve" moves questions to the quiz bank. |
|  |  | Assign Quiz to Class | As a lecturer, I want to publish a generated quiz to my enrolled students. | • Lecturer selects approved questions. • Quiz becomes visible on the student dashboard for that class. |
|  | Performance Analytics | View Class Results | As a lecturer, I want to view all students' overall scores for a specific class. | • Display a leaderboard/table of all enrolled students and their total quiz scores. |
|  |  | View Individual Performance | As a lecturer, I want to see a detailed view of a specific student's answers. | • Click on a student's name. • Display the student's selected answers compared to the correct answer key. |
|  |  | View Class Performance Summary | As a lecturer, I want to see identified weak topics. | • Display charts showing average score, highest/lowest, and error rates per topic. |
|  |  | Export Data | As a lecturer, I want to download results for a class or quiz. | • Lecturer clicks "Export to CSV." • System triggers a download of the structured performance data. |
| Student | Class Interaction | Join Class | As a student, I want to enroll in a class using a class code. | • Display "Join Class" input field. • Student enters valid code. • Student is added to the class and can access materials. |
|  | Assessment | Take Quiz | As a student, I want to answer assigned quizzes. | • Display active quizzes for enrolled classes. • Student can select multiple-choice options and navigate between questions. |
|  |  | Submit Quiz | As a student, I want to submit my completed quiz for evaluation. | • Student clicks "Submit." • Answers are locked and sent to the backend. |
|  |  | View Quiz Results | As a student, I want to see my personal scores and AI evaluation feedback. | • Display total score immediately after submission. • Display topic-level feedback indicating which concepts need review. |
| System | Security & Authorization | RBAC Enforcement | As a system, I want to enforce role-based access control to secure endpoints. | • Validate user role on every request. • Redirect unauthorized users to an error or login page. |
|  |  | Class/Quiz Access Control | As a system, I want to ensure students only access classes they have joined. | • Restrict URL access so students cannot view quizzes or materials for un-enrolled classes. |
|  |  | Password Management | As a system, I want to encrypt and store passwords securely. | • Hash all passwords using standard encryption before storing them in the database. |
|  | Data Validation | File Validation | As a system, I want to validate file type and size during upload. | • Reject files that are not PDF/DOCX. • Reject files exceeding the maximum size limit (e.g., 10MB) with an error message. |
|  |  | Input Validation | As a system, I want to ensure all form inputs are valid. | • Reject empty required fields. • Prevent SQL injection or cross-site scripting (XSS) on all text inputs. |
|  | AI Processing | AI / Vector Processing | As a system, I want to internally process learning materials into embeddings. | • Extract text from uploaded documents. • Chunk text and convert to vector embeddings via Sentence-Transformers. |
|  |  | Result Evaluation & AI Feedback | As a system, I want to evaluate student answers and generate topic feedback. | • Compare student submissions against the answer key. • Calculate accuracy percentage per topic tag and update the database. |
