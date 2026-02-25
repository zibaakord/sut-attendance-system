(() => {
    const API_BASE = "http://localhost:3000/api/professor";
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "PROFESSOR") {
        window.location.href = "../../pages/common/login.html";
        return;
    }

    const authHeaders = () => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    });

    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const day = params.get("day");
    const time = params.get("time");
    const title = params.get("title");
    const sessionId = params.get("sessionId");

    const titleEl = document.getElementById("page-title");
    const infoEl = document.getElementById("session-info");
    const bodyEl = document.getElementById("students-body");
    const saveAllButton = document.getElementById("save-all-attendance");

    const ATTENDANCE_LABELS = {
        present: "حاضر",
        absent: "غایب غیرموجه",
        excused: "غایب موجه",
        unknown: "ثبت نشده",
    };

    const setInfo = () => {
        if (type === "session") {
            titleEl.textContent = "لیست جلسه";
            infoEl.textContent = `${day || ""} ${time || ""} ${title || ""}`.trim();
        } else if (type === "calendar") {
            titleEl.textContent = "جلسات تقویم";
            infoEl.textContent = `روز ${day || ""}`;
        } else {
            infoEl.textContent = "جلسه‌ای انتخاب نشده است.";
        }
    };

    const renderError = (message) => {
        bodyEl.innerHTML = `
            <tr>
                <td colspan="6" class="list-error">
                    ${message}
                </td>
            </tr>
        `;
    };

    const renderEmpty = (message) => {
        bodyEl.innerHTML = `
            <tr>
                <td colspan="6" class="list-empty">
                    ${message}
                </td>
            </tr>
        `;
    };

    const statusLabel = (status) => {
        if (status === "active") return "فعال";
        if (status === "inactive") return "غیرفعال";
        return status || "-";
    };

    const normalizeAttendanceValue = (value) => {
        if (value === "present" || value === "absent" || value === "excused") return value;
        return "";
    };

    const saveAttendance = async (records) => {
        const response = await fetch(`${API_BASE}/sessions/${sessionId}/attendance`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ records }),
        });

        if (!response.ok) {
            throw new Error("Save failed");
        }

        return response.json();
    };

    const buildAttendanceControl = (student) => {
        const wrap = document.createElement("div");
        wrap.className = "attendance-actions";

        const select = document.createElement("select");
        select.className = "attendance-select";
        select.setAttribute("data-student-id", String(student.id));

        const options = [
            { value: "", label: ATTENDANCE_LABELS.unknown },
            { value: "present", label: ATTENDANCE_LABELS.present },
            { value: "absent", label: ATTENDANCE_LABELS.absent },
            { value: "excused", label: ATTENDANCE_LABELS.excused },
        ];

        options.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.label;
            select.appendChild(opt);
        });

        select.value = normalizeAttendanceValue(student.attendance_status);

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "save-attendance-btn";
        saveBtn.textContent = "ذخیره";

        saveBtn.addEventListener("click", async () => {
            const selectedStatus = normalizeAttendanceValue(select.value);
            if (!selectedStatus) {
                alert("ابتدا وضعیت حضور/غیاب را انتخاب کنید.");
                return;
            }

            saveBtn.disabled = true;
            const originalText = saveBtn.textContent;
            saveBtn.textContent = "...";

            try {
                await saveAttendance([
                    {
                        studentId: student.id,
                        status: selectedStatus,
                    },
                ]);
                saveBtn.textContent = "ذخیره شد";
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.disabled = false;
                }, 700);
            } catch (error) {
                saveBtn.disabled = false;
                saveBtn.textContent = originalText;
                alert("ذخیره وضعیت ناموفق بود.");
            }
        });

        wrap.appendChild(select);
        wrap.appendChild(saveBtn);
        return wrap;
    };

    const renderStudents = (students) => {
        if (!students || students.length === 0) {
            renderEmpty("دانشجویی برای این جلسه ثبت نشده است.");
            return;
        }

        bodyEl.innerHTML = "";
        students.forEach((student) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${student.student_number}</td>
                <td>${student.first_name}</td>
                <td>${student.last_name}</td>
                <td>${student.major || "-"}</td>
                <td>${statusLabel(student.status)}</td>
                <td></td>
            `;
            tr.children[5].appendChild(buildAttendanceControl(student));
            bodyEl.appendChild(tr);
        });
    };

    const saveAll = async () => {
        const selects = Array.from(document.querySelectorAll(".attendance-select"));
        const records = selects
            .map((select) => ({
                studentId: Number(select.getAttribute("data-student-id")),
                status: normalizeAttendanceValue(select.value),
            }))
            .filter((item) => Number.isInteger(item.studentId) && item.status);

        if (!records.length) {
            alert("برای ذخیره گروهی، حداقل یک وضعیت معتبر انتخاب کنید.");
            return;
        }

        if (saveAllButton) saveAllButton.disabled = true;
        try {
            await saveAttendance(records);
            alert("تغییرات حضور و غیاب با موفقیت ذخیره شد.");
        } catch (error) {
            alert("ذخیره گروهی وضعیت‌ها ناموفق بود.");
        } finally {
            if (saveAllButton) saveAllButton.disabled = false;
        }
    };

    const fetchStudents = async () => {
        if (!sessionId) {
            renderEmpty("شناسه جلسه ارسال نشده است.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/sessions/${sessionId}/students`, {
                headers: authHeaders(),
            });
            if (!response.ok) {
                renderError("بارگذاری اطلاعات جلسه ناموفق بود.");
                return;
            }

            const data = await response.json();
            if (data?.session) {
                const sessionTitle = [
                    data.session.course_name,
                    `گروه ${data.session.group_number}`,
                    data.session.semester,
                    `جلسه ${data.session.session_number}`,
                ]
                    .filter(Boolean)
                    .join(" - ");
                infoEl.textContent = sessionTitle || infoEl.textContent;
            }

            renderStudents(data.students || []);
        } catch (error) {
            renderError("اتصال به سرور برقرار نشد.");
        }
    };

    setInfo();
    if (saveAllButton) {
        saveAllButton.addEventListener("click", saveAll);
    }
    fetchStudents();
})();
