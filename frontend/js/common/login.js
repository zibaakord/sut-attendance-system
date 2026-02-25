(() => {
  const form = document.querySelector(".login-form");
  const professorBtn = document.getElementById("professor-mode");
  const studentBtn = document.getElementById("student-mode");
  const identifierInput = document.getElementById("userID");
  const passwordInput = document.getElementById("userPassword");

  if (!form || !professorBtn || !studentBtn || !identifierInput || !passwordInput) {
    return;
  }

  let selectedRole = "PROFESSOR";

  const setRole = (role) => {
    selectedRole = role;
    const professorActive = role === "PROFESSOR";
    professorBtn.classList.toggle("active", professorActive);
    studentBtn.classList.toggle("active", !professorActive);
    identifierInput.placeholder = professorActive ? "ایمیل استاد" : "شماره دانشجویی";
  };

  const login = async (event) => {
    event.preventDefault();

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();

    if (!identifier || !password) {
      alert("لطفا نام کاربری و کلمه عبور را وارد کنید.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
          role: selectedRole,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        alert(payload.message || "ورود ناموفق بود.");
        return;
      }

      localStorage.setItem("token", payload.token);
      localStorage.setItem("role", payload.user.role);
      localStorage.setItem("userId", String(payload.user.id));
      localStorage.setItem("identifier", payload.user.identifier);
      if (payload.user.photoUrl) {
        localStorage.setItem("userPhotoUrl", payload.user.photoUrl);
      } else {
        localStorage.removeItem("userPhotoUrl");
      }

      if (payload.user.role === "PROFESSOR") {
        window.location.href = "../professor/dashboard.html";
        return;
      }

      if (payload.user.role === "STUDENT") {
        window.location.href = `../student/dashboard.html?studentId=${payload.user.id}`;
      }
    } catch (error) {
      alert("اتصال به سرور برقرار نشد.");
    }
  };

  professorBtn.addEventListener("click", () => setRole("PROFESSOR"));
  studentBtn.addEventListener("click", () => setRole("STUDENT"));
  form.addEventListener("submit", login);

  setRole("PROFESSOR");
})();
