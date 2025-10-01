<template>
  <div class="login-page">
    <section class="card">
      <header class="card__header">
        <h1 class="card__title">Portal Masuk</h1>
        <p class="card__subtitle">Silakan masuk untuk melanjutkan</p>
      </header>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="form__field">
          <span class="form__label">Email</span>
          <input
            v-model="form.email"
            class="form__input"
            type="email"
            placeholder="nama@perusahaan.com"
            autocomplete="email"
            required
          />
        </label>

        <label class="form__field">
          <span class="form__label">Kata Sandi</span>
          <input
            v-model="form.password"
            class="form__input"
            type="password"
            placeholder="Masukkan kata sandi"
            autocomplete="current-password"
            required
          />
        </label>

        <div class="form__actions">
          <label class="checkbox">
            <input v-model="form.remember" type="checkbox" />
            <span>Ingat saya</span>
          </label>

          <a class="link" href="#">Lupa kata sandi?</a>
        </div>

        <button class="button" type="submit">Masuk</button>
      </form>

      <footer class="card__footer">
        <p>
          Belum punya akun?
          <a class="link" href="#">Daftar sekarang</a>
        </p>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const handleSubmit = () => {
  // Untuk sementara kita hanya menampilkan data di konsol.
  // Nantinya bisa diganti dengan pemanggilan API login.
  console.table(form)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.card {
  width: min(420px, 100%);
  background-color: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card__header {
  text-align: center;
}

.card__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.card__subtitle {
  color: #475569;
  font-size: 0.95rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form__label {
  font-weight: 600;
  color: #0f172a;
}

.form__input {
  border: 1px solid #cbd5f5;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.form__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
}

.link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.button {
  width: 100%;
  padding: 0.85rem;
  border-radius: 0.85rem;
  border: none;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.35);
}

.card__footer {
  text-align: center;
  color: #475569;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .card {
    padding: 2rem;
  }

  .form__actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.65rem;
  }
}
</style>
