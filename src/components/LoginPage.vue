<template>
  <div class="login-layout">
    <section class="login-card">
      <header class="login-card__brand">
        <div class="login-card__logo" aria-hidden="true">AMK</div>
        <div class="login-card__intro">
          <h1>Selamat datang kembali</h1>
          <p>Masuk untuk mengelola aktivitas portal AMK.</p>
        </div>
      </header>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="login-form__field">
          <label class="login-form__label" for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            class="login-form__input"
            type="email"
            autocomplete="email"
            placeholder="nama@perusahaan.com"
            required
          />
        </div>

        <div class="login-form__field">
          <label class="login-form__label" for="password">Kata sandi</label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            class="login-form__input"
            type="password"
            autocomplete="current-password"
            placeholder="Masukkan kata sandi"
            required
          />
        </div>

        <div class="login-form__meta">
          <label class="remember">
            <input
              v-model="form.remember"
              class="remember__checkbox"
              name="remember"
              type="checkbox"
            />
            <span>Ingat saya</span>
          </label>

          <a class="login-form__link" href="#">Lupa kata sandi?</a>
        </div>

        <button class="login-form__submit" type="submit">Masuk</button>
      </form>

      <footer class="login-card__footer">
        <p>
          Belum punya akun?
          <a class="login-form__link" href="#">Buat akun baru</a>
        </p>
      </footer>
    </section>

    <aside class="login-info">
      <h2>Portal karyawan yang serba cepat</h2>
      <p>
        Atur jadwal, pantau progres, dan kolaborasi dengan tim langsung dari satu
        tempat. Sesuaikan teks ini dengan pesan perusahaanmu sendiri.
      </p>
    </aside>
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
  console.table(form)
}
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 460px) minmax(0, 1fr);
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #0f172a;
}

.login-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.75rem;
  padding: clamp(2rem, 5vw, 4rem);
  background-color: #f8fafc;
}

.login-card__brand {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.login-card__logo {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 0.75rem;
  background: linear-gradient(140deg, #2563eb, #7c3aed);
  font-weight: 700;
  color: white;
  letter-spacing: 0.15em;
}

.login-card__intro h1 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.login-card__intro p {
  color: #475569;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form__label {
  display: inline-block;
  font-weight: 600;
  margin-bottom: 0.45rem;
}

.login-form__input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #cbd5f5;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-form__input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);
}

.login-form__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
}

.remember {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  cursor: pointer;
}

.remember__checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
  cursor: pointer;
}

.login-form__link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.login-form__link:hover {
  text-decoration: underline;
}

.login-form__submit {
  border: none;
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.login-form__submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 35px rgba(37, 99, 235, 0.3);
}

.login-card__footer {
  font-size: 0.95rem;
  color: #475569;
}

.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: clamp(2rem, 5vw, 6rem);
  color: white;
  background: linear-gradient(160deg, rgba(37, 99, 235, 0.65), rgba(124, 58, 237, 0.65));
  backdrop-filter: blur(12px);
}

.login-info h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700;
}

.login-info p {
  max-width: 32ch;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

@media (max-width: 960px) {
  .login-layout {
    grid-template-columns: 1fr;
  }

  .login-info {
    order: -1;
    text-align: center;
    align-items: center;
  }

  .login-info p {
    max-width: 45ch;
  }
}
</style>
