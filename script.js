class FocusFoundry {
  constructor() {
    this.isRunning = false;
    this.currentTime = 25 * 60;
    this.isBreak = false;
    this.sessionCount = 1;
    this.maxSessions = 4;
    this.totalStudyTime = 0;
    this.sessionsCompleted = 0;
    this.currentLanguage = localStorage.getItem("appLang") || "en";

    this.tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
    this.courses = JSON.parse(localStorage.getItem("studyCourses")) || [
      { id: 1, name: "Math" },
      { id: 2, name: "Science" },
    ];
    this.questions = JSON.parse(localStorage.getItem("studyQuestions")) || {};

    this.activeCourseId = null;
    this.currentQuizIndex = 0;
    this.quizScore = 0;

    this.translations = {
      en: {
        loading: "Initializing Focus Mode...",
        logoTitle: "Focus Foundry",
        totalStudyTime: "Total Study Time",
        sessionsDone: "Sessions Done",
        newQuote: "New Quote",
        pomodoroTitle: "Pomodoro Timer",
        startFocus: "Start Focus",
        pause: "Pause",
        reset: "Reset",
        stopAlarm: "Stop Alarm",
        focusMode: "Focus",
        breakMode: "Break",
        progressTitle: "Today's Progress",
        tasksCompleted: "Tasks Completed",
        tasksTitle: "Quick Tasks",
        allTasks: "All Tasks",
        pending: "Pending",
        completed: "Completed",
        addTaskPlaceholder: "Add new task...",
        plannerTitle: "My Subjects",
        addCoursePlaceholder: "Add new course...",
        quizTitle: "Quick Quiz",
        selectSubject: "Select Subject",
        questionPlaceholder: "Enter Question",
        opt1: "Option 1",
        opt2: "Option 2",
        opt3: "Option 3",
        opt4: "Option 4",
        correctOpt1: "Option 1 is Correct",
        correctOpt2: "Option 2 is Correct",
        correctOpt3: "Option 3 is Correct",
        correctOpt4: "Option 4 is Correct",
        addQuestion: "Add Question",
        updateQuestion: "Update Question",
        startQuiz: "Start Quiz",
        delete: "Delete",
        noQuestions: "No questions added yet.",
        questionsAvailable: "Questions Available",
        qPrefix: "Q",
      },
      ar: {
        loading: "جاري تشغيل وضع التركيز...",
        logoTitle: "Focus Foundry",
        totalStudyTime: "إجمالي وقت الدراسة",
        sessionsDone: "الجلسات المكتملة",
        newQuote: "حكمة جديدة",
        pomodoroTitle: "مؤقت بومودورو",
        startFocus: "ابدأ التركيز",
        pause: "إيقاف مؤقت",
        reset: "إعادة تعيين",
        stopAlarm: "إيقاف المنبه",
        focusMode: "تركيز",
        breakMode: "استراحة",
        progressTitle: "تقدم اليوم",
        tasksCompleted: "المهام المكتملة",
        tasksTitle: "مهام سريعة",
        allTasks: "كل المهام",
        pending: "قيد الانتظار",
        completed: "مكتملة",
        addTaskPlaceholder: "أضف مهمة جديدة...",
        plannerTitle: "موادي",
        addCoursePlaceholder: "أضف مادة جديدة...",
        quizTitle: "اختبار سريع",
        selectSubject: "اختر المادة",
        questionPlaceholder: "أدخل السؤال",
        opt1: "الخيار 1",
        opt2: "الخيار 2",
        opt3: "الخيار 3",
        opt4: "الخيار 4",
        correctOpt1: "الخيار 1 هو الصحيح",
        correctOpt2: "الخيار 2 هو الصحيح",
        correctOpt3: "الخيار 3 هو الصحيح",
        correctOpt4: "الخيار 4 هو الصحيح",
        addQuestion: "أضف سؤالاً",
        updateQuestion: "تحديث السؤال",
        startQuiz: "ابدأ الاختبار",
        delete: "حذف",
        noQuestions: "لا يوجد أسئلة مضافة بعد.",
        questionsAvailable: "أسئلة متاحة",
        qPrefix: "س",
      },
    };

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadData();
    this.applyLanguage();
    this.startClock();
    this.showRandomQuote();
    this.renderTodos();
    this.renderCourses();
    this.renderQuizSections();
    this.updateStats();

    setTimeout(() => {
      const loader = document.getElementById("loading-screen");
      if (loader) loader.style.display = "none";
    }, 1500);
  }

  cacheElements() {
    this.timerMinutes = document.getElementById("timerMinutes");
    this.timerSeconds = document.getElementById("timerSeconds");
    this.startBtn = document.getElementById("startBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.stopAlarmBtn = document.getElementById("stopAlarmBtn");
    this.focusAlarm = document.getElementById("focusAlarm");
    this.breakAlarm = document.getElementById("breakAlarm");
    this.timerCircle = document.querySelector(".progress-ring__circle");
    this.langToggle = document.getElementById("lang-toggle");
    this.themeToggle = document.getElementById("theme-toggle");
    this.newCourseInput = document.getElementById("newCourseInput");
    this.addCourseBtn = document.getElementById("addCourseBtn");
    this.courseList = document.getElementById("courseList");
    this.quizSectionsContainer = document.getElementById(
      "quizSectionsContainer",
    );
    this.quizSubjectSelect = document.getElementById("quizSubjectSelect");
    this.addQuizQuestionBtn = document.getElementById("addQuizQuestionBtn");
    this.totalStudyTimeEl = document.getElementById("totalStudyTime");
    this.sessionsCompletedEl = document.getElementById("sessionsCompleted");
    this.dailyQuote = document.getElementById("dailyQuote");
    this.newQuoteBtn = document.getElementById("newQuoteBtn");
    this.newTaskInput = document.getElementById("newTaskInput");
    this.addTaskBtn = document.getElementById("addTaskBtn");
    this.todoList = document.getElementById("todoList");
    this.taskFilter = document.getElementById("taskFilter");
    this.tasksCompletedEl = document.getElementById("tasksCompleted");
    this.manageQuestionsArea = document.getElementById("manageQuestionsArea");
    this.questionsListContainer = document.getElementById(
      "questionsListContainer",
    );
    this.editingQuestionIndex = document.getElementById("editingQuestionIndex");
    this.quizManagerForm = document.querySelector(".quiz-manager-form");
    this.activeQuizArea = document.getElementById("activeQuizArea");
    this.quizControls = document.getElementById("quizControls");
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());
    this.stopAlarmBtn.addEventListener("click", () => this.stopAlarm());
    this.langToggle.addEventListener("click", () => this.toggleLanguage());
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
    this.addCourseBtn.addEventListener("click", () => this.addCourse());
    this.addQuizQuestionBtn.addEventListener("click", () => this.addQuestion());
    this.addTaskBtn.addEventListener("click", () => this.addTodo());
    this.newQuoteBtn.addEventListener("click", () => this.showRandomQuote());
    this.taskFilter.addEventListener("change", () => this.renderTodos());

    document.getElementById("exitQuizBtn").addEventListener("click", () => {
      this.activeQuizArea.style.display = "none";
      this.quizControls.style.display = "none";
      this.quizSectionsContainer.style.display = "grid";
      this.quizManagerForm.style.display = "block";
    });
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === "en" ? "ar" : "en";
    localStorage.setItem("appLang", this.currentLanguage);
    this.applyLanguage();
  }

  applyLanguage() {
    const t = this.translations[this.currentLanguage];
    document.documentElement.lang = this.currentLanguage;
    document.body.classList.toggle("rtl", this.currentLanguage === "ar");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key]) el.placeholder = t[key];
    });

    this.renderQuizSections();
    this.renderCourses();
    this.renderTodos();

    if (
      this.manageQuestionsArea.style.display === "block" &&
      this.quizSubjectSelect.value
    ) {
      this.manageSubjectQuestions(this.quizSubjectSelect.value);
    }
  }

  toggleTheme() {
    document.body.classList.toggle("light-theme");
    const icon = this.themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startBtn.style.display = "none";
      this.pauseBtn.style.display = "flex";
      this.animateProgressCircle();
    }
  }

  pauseTimer() {
    this.isRunning = false;
    this.startBtn.style.display = "flex";
    this.pauseBtn.style.display = "none";
  }

  resetTimer() {
    this.isRunning = false;
    this.currentTime = this.isBreak ? 5 * 60 : 25 * 60;
    this.updateTimerDisplay();
    this.startBtn.style.display = "flex";
    this.pauseBtn.style.display = "none";
    this.stopAlarmBtn.style.display = "none";
    this.resetBtn.style.display = "flex";
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime % 60;
    this.timerMinutes.textContent = minutes.toString().padStart(2, "0");
    this.timerSeconds.textContent = seconds.toString().padStart(2, "0");
  }

  startClock() {
    setInterval(() => {
      if (this.isRunning) {
        this.currentTime--;
        this.updateTimerDisplay();
        this.animateProgressCircle();
        if (this.currentTime <= 0) this.sessionComplete();
      }
    }, 1000);
  }

  animateProgressCircle() {
    const radius = window.innerWidth <= 480 ? 100 : 110;
    this.timerCircle.setAttribute("r", radius);
    const circumference = 2 * Math.PI * radius;
    const total = this.isBreak ? 300 : 1500;
    const offset = (this.currentTime / total) * circumference;

    this.timerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    this.timerCircle.style.strokeDashoffset = offset;
  }

  sessionComplete() {
    this.isRunning = false;
    this.showNotification(this.isBreak ? "Break Done!" : "Session Done!");

    try {
      this.isBreak ? this.breakAlarm.play() : this.focusAlarm.play();
    } catch (e) {
      console.warn("Audio play prevented by browser policy.");
    }

    this.startBtn.style.display = "none";
    this.pauseBtn.style.display = "none";
    this.resetBtn.style.display = "none";
    this.stopAlarmBtn.style.display = "flex";
  }

  stopAlarm() {
    this.focusAlarm.pause();
    this.focusAlarm.currentTime = 0;
    this.breakAlarm.pause();
    this.breakAlarm.currentTime = 0;

    if (!this.isBreak) {
      this.isBreak = true;
      this.currentTime = 5 * 60;
      this.sessionsCompleted++;
      this.totalStudyTime += 25 * 60;
      document
        .getElementById("timerMode")
        .setAttribute("data-i18n", "breakMode");
    } else {
      this.isBreak = false;
      this.currentTime = 25 * 60;
      this.sessionCount++;
      document
        .getElementById("timerMode")
        .setAttribute("data-i18n", "focusMode");
    }

    document.getElementById("sessionCounter").textContent =
      `Session ${this.sessionCount}/${this.maxSessions}`;
    this.applyLanguage();
    this.updateStats();
    this.saveData();
    this.resetTimer();
  }

  addTodo() {
    const text = this.newTaskInput.value.trim();
    if (text) {
      this.tasks.push({
        id: Date.now(),
        text,
        completed: false,
        timestamp: new Date().toISOString(),
      });
      this.newTaskInput.value = "";
      this.renderTodos();
      this.saveData();
    }
  }

  toggleTodo(id) {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    this.renderTodos();
    this.saveData();
  }

  deleteTodo(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.renderTodos();
    this.saveData();
  }

  renderTodos() {
    if (!this.todoList) return;
    const filter = this.taskFilter.value;
    const filtered = this.tasks.filter(
      (t) =>
        filter === "all" ||
        (filter === "completed" ? t.completed : !t.completed),
    );

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const langCode = this.currentLanguage === "ar" ? "ar-EG" : "en-US";

    this.todoList.innerHTML = filtered
      .map((t) => {
        const dateStr = t.timestamp
          ? new Date(t.timestamp).toLocaleDateString(langCode, options)
          : "";
        return `
        <div class="todo-item ${t.completed ? "completed" : ""}">
          <div class="todo-check">
              <input type="checkbox" ${t.completed ? "checked" : ""} onchange="focusFoundry.toggleTodo(${t.id})">
              <div class="todo-text-container">
                  <span>${t.text}</span>
                  ${dateStr ? `<span class="task-timestamp">${dateStr}</span>` : ""}
              </div>
          </div>
          <button onclick="focusFoundry.deleteTodo(${t.id})"><i class="fas fa-trash"></i></button>
        </div>
      `;
      })
      .join("");
    this.updateStats();
  }

  addCourse() {
    const name = this.newCourseInput.value.trim();
    if (name) {
      this.courses.push({ id: Date.now(), name });
      this.newCourseInput.value = "";
      this.renderCourses();
      this.renderQuizSections();
      this.saveData();
    }
  }

  deleteCourse(id) {
    this.courses = this.courses.filter((c) => c.id !== id);
    delete this.questions[id];
    this.renderCourses();
    this.renderQuizSections();
    this.saveData();
  }

  renderCourses() {
    if (!this.courseList) return;
    this.courseList.innerHTML = this.courses
      .map(
        (c) => `
      <div class="todo-item">
        <div class="todo-check">
            <i class="fas fa-book" style="color: var(--accent-primary); margin-top: 5px;"></i>
            <div class="todo-text-container"><span>${c.name}</span></div>
        </div>
        <button onclick="focusFoundry.deleteCourse(${c.id})"><i class="fas fa-times"></i></button>
      </div>
    `,
      )
      .join("");
  }

  addQuestion() {
    const courseId = this.quizSubjectSelect.value;
    const questionText = document
      .getElementById("quizQuestionInput")
      .value.trim();
    const optionInputs = document.querySelectorAll(".opt-in");
    const options = Array.from(optionInputs).map((i) => i.value.trim());
    const correct = parseInt(
      document.getElementById("quizCorrectAnswer").value,
      10,
    );
    const editIdx = parseInt(this.editingQuestionIndex.value, 10);

    if (!courseId || !questionText || options.some((o) => !o)) {
      this.showNotification("Please fill all fields");
      return;
    }

    if (!this.questions[courseId]) this.questions[courseId] = [];

    if (editIdx > -1) {
      this.questions[courseId][editIdx] = {
        question: questionText,
        options,
        correct,
      };
      this.editingQuestionIndex.value = "-1";
      document.getElementById("quizSubmitBtnText").textContent =
        this.translations[this.currentLanguage].addQuestion;
      this.showNotification("Question Updated!");
    } else {
      this.questions[courseId].push({
        question: questionText,
        options,
        correct,
      });
    }

    document.getElementById("quizQuestionInput").value = "";
    optionInputs.forEach((i) => (i.value = ""));
    this.saveData();
    this.renderQuizSections();

    if (this.manageQuestionsArea.style.display === "block") {
      this.manageSubjectQuestions(courseId);
    }
  }

  renderQuizSections() {
    if (!this.quizSectionsContainer) return;
    const t = this.translations[this.currentLanguage];

    this.quizSubjectSelect.innerHTML =
      `<option value="">${t.selectSubject}</option>` +
      this.courses
        .map((c) => `<option value="${c.id}">${c.name}</option>`)
        .join("");

    this.quizSectionsContainer.innerHTML = this.courses
      .map((course) => {
        const qList = this.questions[course.id] || [];
        return `
        <div class="quiz-subject-block">
            <h3 style="margin-bottom: 0.8rem; font-size: 1.1rem;">${course.name}</h3>
            ${
              qList.length > 0
                ? `<button onclick="focusFoundry.startSubjectQuiz(${course.id})" class="btn-primary btn-sm mb-1 full-width">${t.startQuiz}</button>
                 <span onclick="focusFoundry.manageSubjectQuestions(${course.id})" style="font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; text-decoration: underline;">${qList.length} ${t.questionsAvailable}</span>`
                : `<p style="font-size: 0.85rem; color: var(--text-secondary);">${t.noQuestions}</p>`
            }
        </div>
      `;
      })
      .join("");
  }

  manageSubjectQuestions(courseId) {
    const course = this.courses.find((c) => c.id == courseId);
    const qList = this.questions[courseId] || [];
    const qPrefix = this.translations[this.currentLanguage].qPrefix;

    document.getElementById("manageSubjectTitle").textContent = course.name;
    this.quizSectionsContainer.style.display = "none";
    this.manageQuestionsArea.style.display = "block";

    this.questionsListContainer.innerHTML = qList
      .map(
        (q, index) => `
      <div class="todo-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>${qPrefix}${index + 1}: ${q.question}</strong>
              <div style="display: flex; gap: 10px;">
                  <button onclick="focusFoundry.editQuestion(${courseId}, ${index})" style="color: var(--accent-primary);"><i class="fas fa-edit"></i></button>
                  <button onclick="focusFoundry.deleteQuestion(${courseId}, ${index})" style="color: var(--danger);"><i class="fas fa-trash"></i></button>
              </div>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
              ${q.options.map((opt, i) => `<span style="${i === q.correct ? "color: var(--success); font-weight: 700;" : ""}">${opt}</span>`).join(" | ")}
          </div>
      </div>
    `,
      )
      .join("");
  }

  exitManagement() {
    this.manageQuestionsArea.style.display = "none";
    this.quizSectionsContainer.style.display = "grid";
    this.editingQuestionIndex.value = "-1";
    document.getElementById("quizSubmitBtnText").textContent =
      this.translations[this.currentLanguage].addQuestion;
  }

  deleteQuestion(courseId, index) {
    if (confirm("Are you sure you want to delete this question?")) {
      this.questions[courseId].splice(index, 1);
      this.saveData();
      this.renderQuizSections();
      this.manageSubjectQuestions(courseId);
    }
  }

  editQuestion(courseId, index) {
    const q = this.questions[courseId][index];
    this.quizSubjectSelect.value = courseId;
    document.getElementById("quizQuestionInput").value = q.question;
    const optionInputs = document.querySelectorAll(".opt-in");
    q.options.forEach((opt, i) => {
      optionInputs[i].value = opt;
    });
    document.getElementById("quizCorrectAnswer").value = q.correct;
    this.editingQuestionIndex.value = index;
    document.getElementById("quizSubmitBtnText").textContent =
      this.translations[this.currentLanguage].updateQuestion;
    this.quizManagerForm.scrollIntoView({ behavior: "smooth" });
    this.showNotification("Editing mode enabled");
  }

  startSubjectQuiz(courseId) {
    this.activeCourseId = courseId;
    this.currentQuizIndex = 0;
    this.quizScore = 0;

    this.quizSectionsContainer.style.display = "none";
    this.manageQuestionsArea.style.display = "none";
    this.quizManagerForm.style.display = "none";
    this.activeQuizArea.style.display = "block";
    this.quizControls.style.display = "flex";

    this.showQuestion();
  }

  showQuestion() {
    const q = this.questions[this.activeCourseId][this.currentQuizIndex];
    document.getElementById("quizQuestion").innerHTML =
      `<h3 style="margin-bottom: 1rem;">${q.question}</h3>`;
    document.getElementById("quizOptions").innerHTML = q.options
      .map(
        (opt, i) =>
          `<button class="quiz-option" onclick="focusFoundry.handleAnswer(${i})">${opt}</button>`,
      )
      .join("");
    document.getElementById("quizResult").style.display = "none";
  }

  handleAnswer(idx) {
    const q = this.questions[this.activeCourseId][this.currentQuizIndex];
    const isCorrect = idx === q.correct;
    if (isCorrect) this.quizScore++;

    const optionBtns = document.querySelectorAll(".quiz-option");
    optionBtns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) {
        btn.style.backgroundColor = "var(--success)";
        btn.style.borderColor = "var(--success)";
        btn.style.color = "#fff";
      } else if (i === idx && !isCorrect) {
        btn.style.backgroundColor = "var(--danger)";
        btn.style.borderColor = "var(--danger)";
        btn.style.color = "#fff";
      }
    });

    setTimeout(() => {
      if (
        this.currentQuizIndex <
        this.questions[this.activeCourseId].length - 1
      ) {
        this.currentQuizIndex++;
        this.showQuestion();
      } else {
        this.showQuizResult();
      }
    }, 1200);
  }

  showQuizResult() {
    const total = this.questions[this.activeCourseId].length;
    document.getElementById("quizQuestion").innerHTML =
      `<h3>Quiz Finished!</h3>`;
    document.getElementById("quizOptions").innerHTML = "";
    const res = document.getElementById("quizResult");
    res.style.display = "block";
    res.innerHTML = `Score: ${this.quizScore} / ${total} (${Math.round((this.quizScore / total) * 100)}%)`;
  }

  updateStats() {
    const hrs = Math.floor(this.totalStudyTime / 3600);
    const mins = Math.floor((this.totalStudyTime % 3600) / 60);
    this.totalStudyTimeEl.textContent = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
    this.sessionsCompletedEl.textContent = this.sessionsCompleted;
    const done = this.tasks.filter((t) => t.completed).length;
    this.tasksCompletedEl.textContent = `${done}/${this.tasks.length}`;
  }

  showRandomQuote() {
    const quotes = [
      "الخيميائي (باولو كويلو): لما تعوز حاجة بجد، الكون كله بيتسخر عشان يساعدك توصلها.",
      "العادات السبع للناس الأكثر فعالية (ستيفن كوفي): أنت مش نتاج الظروف اللي عشتها، أنت نتاج القرارات اللي بتاخدها كل يوم.",
      "الأب الغني والأب الفقير (روبرت كيوساكي): الغني ما بيشتغلش عشان الفلوس، الفلوس هي اللي بتشتغل عنده.",
      "فكر وازدد ثراءً (نابليون هيل): أي حاجة يقدر عقلك يتخيلها ويصدقها، يقدر ينفذها.",
      "الراهب الذي باع سيارته الفيراري (روبن شارما): أسرار السعادة بتبدأ من جواك، مش من الحاجات اللي بتملكها برا.",
      "كيف تكسب الأصدقاء وتؤثر في الناس (ديل كارنيجي): عشان تأثر في الناس، لازم تهتم بيهم بجد، مش بس تتظاهر بالاهتمام.",
      "قوة الآن (إيكهارت تول): ما تضيعش حياتك في الماضي اللي راح أو المستقبل اللي لسه مجاش، ركز في اللحظة اللي أنت فيها دلوقتي.",
      "الإنسان يبحث عن المعنى (فيكتور فرانكل): لو لقيت سبب تعيش عشانه، تقدر تستحمل أي ظروف صعبة تقابلك.",
      "قوة العزيمة (واين داير): لما تغير نظرتك للأشياء، الأشياء نفسها بتتغير.",
      "الأمير الصغير (أنطوان دو سانت إكزوبيري): الحقيقة دايمًا بتبان بالقلب، العين لوحدها مش كفاية عشان تشوف الصح.",
      "خمسة أشياء يندم عليها الناس قبل الموت (بروني وير): أكبر ندم بيحس بيه الواحد وهو ماشي، إنه ما عاش حياته زي ما هو كان عايز، وعاشها زي ما الناس عايزاه.",
      "فن الحرب (سون تزو): النصر الحقيقي هو إنك تكسب المعركة من غير ما تضطر تحارب.",
      "أيقظ العملاق الذي بداخلك (توني روبنز): قراراتك هي اللي بتحدد مصيرك، مش ظروفك.",
      "كتاب التأملات (ماركوس أوريليوس): السعادة في حياتك معتمدة على نوعية أفكارك، خلي أفكارك دايماً قوية.",
      "العمل العميق (كال نيوبورت): القدرة على التركيز من غير تشتيت هي المهارة اللي بتميز أي حد ناجح في العصر ده.",
      "القيادة الجريئة (برينيه براون): الشجاعة مش إنك ما تخافش، الشجاعة إنك تخاف وتكمل طريقك برضه.",
      "سيكولوجية النجاح (براين تريسي): حدودك الوحيدة هي الحدود اللي أنت راسمها في عقلك لنفسك.",
      "العقلية (كارول دويك): لو آمنت إن ذكاءك ومهاراتك ممكن يتطوروا، هتوصل لأماكن ما كنتش تتخيلها.",
      "ابدأ بـ لماذا (سايمون سينك): الناس مش بتشتري 'إيه' اللي بتعمله، الناس بتشتري 'ليه' بتعمله.",
      "استراتيجية المحيط الأزرق (تشان كيم): ما تحاولش تنافس حد في ملعب زحمة، اصنع ملعبك الخاص اللي مفيش فيه منافسين.",
      "عادات ذرية (جيمس كلير): النجاح مش بيجي من قرارات كبيرة ومفاجئة، بيجي من تغييرات صغيرة جداً بس بتتعمل بانتظام.",
      "اللمسة الأخيرة (مالكوم جلادويل): الموهبة لوحدها ما بتعملش بطل، البطل بيتعمل بـ 10 آلاف ساعة شغل وتدريب.",
      "لا تهتم بالتفاهات (ريتشارد كارلسون): الحياه أقصر من إننا نضيعها في تفاصيل ما تستهلش، ركز على المهم.",
      "الشيء الوحيد (جاري كيلر): اسأل نفسك دايماً: إيه الشيء الوحيد اللي لو عملته، كل الحاجات التانية هتبقى أسهل أو مش ضرورية؟",
      "الاستثناء (تيم فيريس): مش لازم تشتغل أكتر، لازم تشتغل أذكى.",
      "صناعة العظماء (نابليون هيل): الخوف مجرد حالة ذهنية، وأي حالة ذهنية تقدر تتحكم فيها وتغيرها.",
      "البحث عن التميز (توم بيترز): اللي بيتميز هو اللي بيعمل حاجات عادية بطريقة غير عادية.",
      "المتمرد (أوشو): الحرية الحقيقية إنك تكون نفسك، مش النسخة اللي الناس مستنياها منك.",
      "التفكير بسرعة وببطء (دانيال كانيمان): ساعات عقلك بيخدعك في اتخاذ القرار، اتعلم إمتى توقف وتفكر بالمنطق.",
      "البدء (سيث جودين): أهم خطوة في أي مشروع هي 'البداية'، الباقي بييجي مع الوقت والتعلم.",
    ];
    this.dailyQuote.textContent =
      quotes[Math.floor(Math.random() * quotes.length)];
  }

  showNotification(msg) {
    const n = document.getElementById("notification");
    n.textContent = msg;
    n.classList.add("show");
    setTimeout(() => n.classList.remove("show"), 3000);
  }

  saveData() {
    localStorage.setItem("studyTasks", JSON.stringify(this.tasks));
    localStorage.setItem("studyCourses", JSON.stringify(this.courses));
    localStorage.setItem("studyQuestions", JSON.stringify(this.questions));
    localStorage.setItem("totalStudyTime", this.totalStudyTime);
    localStorage.setItem("sessionsCompleted", this.sessionsCompleted);
  }

  loadData() {
    this.totalStudyTime = parseInt(localStorage.getItem("totalStudyTime")) || 0;
    this.sessionsCompleted =
      parseInt(localStorage.getItem("sessionsCompleted")) || 0;
  }
}

const focusFoundry = new FocusFoundry();
