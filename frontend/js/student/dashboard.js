(() => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    const table = document.getElementById("courses-table");
    const coursesBody = document.getElementById("courses-body");

    const totalCoursesEl = document.getElementById("total-courses");
    const avgAttendanceEl = document.getElementById("avg-attendance");
    const lowAttendanceEl = document.getElementById("low-attendance");
    const statusBarsEl = document.getElementById("status-bars");
    const studentStatsBody = document.getElementById("student-stats-body");

    const MOBILE_BREAKPOINT = window.matchMedia("(max-width: 980px)");
    const API_BASE = "http://localhost:3000/api/student";
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedStudentId = Number(localStorage.getItem("userId"));
    const DEFAULT_STUDENT_ID =
        Number.isInteger(storedStudentId) && storedStudentId > 0 ? storedStudentId : 1;

    if (!token || role !== "STUDENT") {
        window.location.href = "../../pages/common/login.html";
        return;
    }

    const authHeaders = () => ({ Authorization: `Bearer ${token}` });

    const updateResponsiveState = () => {
        document.body.classList.toggle("is-mobile", MOBILE_BREAKPOINT.matches);
        if (!MOBILE_BREAKPOINT.matches && sidebar) {
            sidebar.classList.remove("open");
        }
    };

    const getStudentId = () => {
        const params = new URLSearchParams(window.location.search);
        const idFromQuery = Number(params.get("studentId"));
        return Number.isInteger(idFromQuery) && idFromQuery > 0
            ? idFromQuery
            : DEFAULT_STUDENT_ID;
    };

    const statusClass = (status) => {
        if (status === "At Risk") return "risk";
        if (status === "Warning") return "caution";
        return "good";
    };

    const statusLabel = (status) => {
        if (status === "At Risk") return "در معرض خطر";
        if (status === "Warning") return "هشدار";
        if (status === "Excellent") return "عالی";
        return "خوب";
    };

    const createCell = (label, value) => {
        const td = document.createElement("td");
        td.setAttribute("data-label", label);
        td.textContent = String(value ?? "");
        return td;
    };

    const renderCourses = (courses) => {
        if (!coursesBody) return;
        coursesBody.innerHTML = "";

        if (!Array.isArray(courses) || courses.length === 0) {
            const row = document.createElement("tr");
            const emptyCell = createCell("درس", "درسی برای این دانشجو یافت نشد.");
            emptyCell.colSpan = 6;
            row.appendChild(emptyCell);
            coursesBody.appendChild(row);
            return;
        }

        courses.forEach((course) => {
            const row = document.createElement("tr");
            row.setAttribute("data-attendance", String(course.attendance_rate ?? 0));

            row.appendChild(createCell("درس", `${course.course_name} (${course.course_code})`));
            row.appendChild(createCell("استاد", course.instructor));
            row.appendChild(createCell("جلسات برگزارشده", course.sessions_held));
            row.appendChild(createCell("جلسات حاضر", course.sessions_attended));

            const attendanceCell = document.createElement("td");
            attendanceCell.setAttribute("data-label", "درصد حضور");

            const progress = document.createElement("div");
            progress.className = "progress";
            const progressBar = document.createElement("span");
            progressBar.style.width = `${course.attendance_rate}%`;
            progress.appendChild(progressBar);

            const attendanceText = document.createElement("small");
            attendanceText.textContent = `${course.attendance_rate}%`;

            attendanceCell.appendChild(progress);
            attendanceCell.appendChild(attendanceText);
            row.appendChild(attendanceCell);

            const statusCell = document.createElement("td");
            statusCell.setAttribute("data-label", "وضعیت");
            const statusBadge = document.createElement("span");
            statusBadge.className = `status ${statusClass(course.status)}`;
            statusBadge.textContent = statusLabel(course.status);
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            coursesBody.appendChild(row);
        });
    };

    const renderSummary = (summary) => {
        if (totalCoursesEl) totalCoursesEl.textContent = String(summary.totalCourses ?? 0);
        if (avgAttendanceEl) avgAttendanceEl.textContent = `${summary.avgAttendance ?? 0}%`;
        if (lowAttendanceEl) {
            lowAttendanceEl.textContent = String(summary.lowAttendanceCourses ?? 0);
        }
    };

    const renderReports = (courses) => {
        const counts = { good: 0, warning: 0, risk: 0 };

        courses.forEach((course) => {
            const rate = Number(course.attendance_rate || 0);
            if (rate < 75) counts.risk += 1;
            else if (rate < 90) counts.warning += 1;
            else counts.good += 1;
        });

        const maxCount = Math.max(counts.good, counts.warning, counts.risk, 1);

        if (statusBarsEl) {
            statusBarsEl.innerHTML = [
                { key: "good", title: "خوب / عالی", value: counts.good },
                { key: "warning", title: "هشدار", value: counts.warning },
                { key: "risk", title: "در معرض خطر", value: counts.risk },
            ]
                .map((item) => {
                    const width = Math.round((item.value / maxCount) * 100);
                    return `
                        <div class="status-row">
                            <span>${item.title}</span>
                            <div class="status-track"><div class="status-fill" style="width:${width}%"></div></div>
                            <strong>${item.value}</strong>
                        </div>
                    `;
                })
                .join("");
        }

        if (studentStatsBody) {
            if (!courses.length) {
                studentStatsBody.innerHTML = "<tr><td colspan='3'>داده‌ای ثبت نشده است.</td></tr>";
            } else {
                const rows = [...courses].sort((a, b) => Number(b.attendance_rate) - Number(a.attendance_rate));
                studentStatsBody.innerHTML = rows
                    .map(
                        (course) => `
                            <tr>
                                <td>${course.course_name}</td>
                                <td>${course.attendance_rate}%</td>
                                <td>${statusLabel(course.status)}</td>
                            </tr>
                        `
                    )
                    .join("");
            }
        }
    };

    const loadDashboard = async () => {
        const studentId = getStudentId();

        try {
            const response = await fetch(`${API_BASE}/${studentId}/dashboard`, {
                headers: authHeaders(),
            });
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const payload = await response.json();
            const courses = payload.courses || [];

            renderSummary(payload.summary || {});
            renderReports(courses);
            renderCourses(courses);
        } catch (error) {
            renderSummary({ totalCourses: 0, avgAttendance: 0, lowAttendanceCourses: 0 });
            renderReports([]);
            renderCourses([]);
        }
    };

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    if (typeof MOBILE_BREAKPOINT.addEventListener === "function") {
        MOBILE_BREAKPOINT.addEventListener("change", updateResponsiveState);
    } else if (typeof MOBILE_BREAKPOINT.addListener === "function") {
        MOBILE_BREAKPOINT.addListener(updateResponsiveState);
    }

    updateResponsiveState();
    if (table) {
        loadDashboard();
    }
})();
