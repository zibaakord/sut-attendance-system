(() => {
    const listPageUrl = "../../pages/professor/list.html";
    const API_BASE = "http://localhost:3000/api/professor";
    const storedProfessorId = Number(localStorage.getItem("userId"));
    const DEFAULT_PROFESSOR_ID = Number.isInteger(storedProfessorId) && storedProfessorId > 0
        ? storedProfessorId
        : 1;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "PROFESSOR") {
        window.location.href = "../../pages/common/login.html";
        return;
    }

    const toParam = (value) => encodeURIComponent(String(value ?? "").trim());
    const authHeaders = () => ({ Authorization: `Bearer ${token}` });

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    const weekProgram = document.getElementById("weekly-program");

    const totalSessionsEl = document.getElementById("total-sessions");
    const activeCoursesEl = document.getElementById("active-courses");
    const weekSessionsEl = document.getElementById("week-sessions");
    const dayBarsEl = document.getElementById("day-bars");
    const courseStatsBody = document.getElementById("course-stats-body");

    const DAY_ORDER = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه"];
    const DAY_FROM_JS = {
        6: "شنبه",
        0: "یک‌شنبه",
        1: "دوشنبه",
        2: "سه‌شنبه",
        3: "چهارشنبه",
        4: "پنج‌شنبه",
    };

    const navigateToList = (params) => {
        const query = Object.entries(params)
            .map(([key, value]) => `${toParam(key)}=${toParam(value)}`)
            .join("&");
        window.location.href = `${listPageUrl}?${query}`;
    };

    const makeClickable = (el, onActivate) => {
        if (!el) return;
        el.classList.add("is-clickable");
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");

        const handler = () => onActivate(el);

        el.addEventListener("click", handler);
        el.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handler();
            }
        });
    };

    const clearWeeklyTable = () => {
        if (!weekProgram) return;
        const cells = weekProgram.querySelectorAll("tr[data-day] td[data-slot]");
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.removeAttribute("data-session-id");
        });
    };

    const renderDayBars = (dayCounts) => {
        if (!dayBarsEl) return;
        const max = Math.max(...Object.values(dayCounts), 1);
        dayBarsEl.innerHTML = DAY_ORDER.map((day) => {
            const count = dayCounts[day] || 0;
            const width = Math.round((count / max) * 100);
            return `
                <div class="day-bar-row">
                    <span>${day}</span>
                    <div class="day-bar-track"><div class="day-bar-fill" style="width:${width}%"></div></div>
                    <strong>${count}</strong>
                </div>
            `;
        }).join("");
    };

    const renderCourseTable = (courseMap) => {
        if (!courseStatsBody) return;
        const rows = Array.from(courseMap.values()).sort((a, b) => b.count - a.count);
        if (rows.length === 0) {
            courseStatsBody.innerHTML = "<tr><td colspan='3'>داده‌ای ثبت نشده است.</td></tr>";
            return;
        }

        courseStatsBody.innerHTML = rows
            .map((item) => `<tr><td>${item.name}</td><td>${item.count}</td><td>${item.lastDate}</td></tr>`)
            .join("");
    };

    const fillWeeklyTable = (sessions) => {
        if (!weekProgram) return;
        const rowByDay = Object.fromEntries(
            Array.from(weekProgram.querySelectorAll("tr[data-day]")).map((row) => [row.getAttribute("data-day"), row])
        );

        sessions.forEach((session) => {
            const date = new Date(session.session_date);
            if (Number.isNaN(date.getTime())) return;

            const day = DAY_FROM_JS[date.getDay()];
            if (!day || !rowByDay[day]) return;

            const slot = ((Number(session.session_number) - 1) % 6) + 1;
            const cell = rowByDay[day].querySelector(`td[data-slot='${slot}']`);
            if (!cell) return;

            const title = `${session.course_name} | گروه ${session.group_number} | جلسه ${session.session_number}`;
            cell.textContent = title;
            cell.setAttribute("data-session-id", session.session_id);

            makeClickable(cell, () => {
                navigateToList({
                    type: "session",
                    day,
                    time: weekProgram.querySelector("tr.program-head td:nth-child(" + (slot + 1) + ")")?.textContent || "",
                    title,
                    sessionId: session.session_id,
                });
            });
        });
    };

    const renderStats = (sessions) => {
        const dayCounts = Object.fromEntries(DAY_ORDER.map((d) => [d, 0]));
        const courseMap = new Map();

        const today = new Date();
        const plus7 = new Date();
        plus7.setDate(today.getDate() + 7);

        let weekCount = 0;

        sessions.forEach((session) => {
            const date = new Date(session.session_date);
            const day = Number.isNaN(date.getTime()) ? null : DAY_FROM_JS[date.getDay()];
            if (day && dayCounts[day] !== undefined) dayCounts[day] += 1;

            if (!Number.isNaN(date.getTime()) && date >= today && date <= plus7) {
                weekCount += 1;
            }

            const key = `${session.course_code}-${session.group_number}`;
            if (!courseMap.has(key)) {
                courseMap.set(key, {
                    name: `${session.course_name} (گروه ${session.group_number})`,
                    count: 0,
                    lastDate: session.session_date,
                });
            }
            const item = courseMap.get(key);
            item.count += 1;
            if (session.session_date > item.lastDate) item.lastDate = session.session_date;
        });

        if (totalSessionsEl) totalSessionsEl.textContent = String(sessions.length);
        if (activeCoursesEl) activeCoursesEl.textContent = String(courseMap.size);
        if (weekSessionsEl) weekSessionsEl.textContent = String(weekCount);

        renderDayBars(dayCounts);
        renderCourseTable(courseMap);
    };

    const loadSessions = async () => {
        clearWeeklyTable();

        try {
            const response = await fetch(`${API_BASE}/${DEFAULT_PROFESSOR_ID}/sessions`, {
                headers: authHeaders(),
            });
            if (!response.ok) return;

            const sessions = await response.json();
            if (!Array.isArray(sessions)) return;

            fillWeeklyTable(sessions);
            renderStats(sessions);
        } catch (error) {
            return;
        }
    };

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    loadSessions();
})();
