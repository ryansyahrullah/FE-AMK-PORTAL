# amk-portal

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Setelah perintah tersebut berjalan, Vite akan menampilkan alamat lokal (biasanya
`http://localhost:5173/`). Buka alamat itu di browser; halaman login langsung
muncul karena rute utama (`/`) merender `LoginPage`. Jika ingin memastikan, kamu
juga bisa membuka `http://localhost:5173/login`—jalur tersebut adalah alias dari
halaman yang sama.

### Compile and Minify for Production

```sh
npm run build
```

Untuk mencoba hasil build statis, jalankan:

```sh
npm run preview
```

Perintah `preview` akan menyalakan server sementara di alamat yang umumnya
`http://localhost:4173/`. Sama seperti saat `npm run dev`, kamu bisa membuka
akar situs (`/`) atau langsung `http://localhost:4173/login`; keduanya merender
halaman login yang sama karena `/login` hanyalah alias.

## Menyalin perubahan dari commit ini

Jika kamu melihat berkas yang kutambahkan melalui tampilan _diff_ (misalnya di GitHub atau GitLab), baris-baris baru biasanya memiliki tanda `+` di bagian paling kiri. Tanda tersebut hanya penanda perubahan dan **tidak** perlu disalin ke editor.

Untuk menyalin kode secara manual:

1. Buka berkas tujuan di editor lokalmu.
2. Salin bagian kode dari tampilan _diff_ **tanpa** karakter `+` di awal baris.
3. Tempelkan kode tersebut menggantikan isi berkas lama. Misalnya:
   - Ganti isi `src/App.vue` sehingga hanya merender `<RouterView />` dari Vue Router.
   - Tambahkan berkas baru `src/router/index.js` untuk mendaftarkan rute utama `/` (dengan alias `/login`) yang mengarah ke `LoginPage`.
   - Tambahkan berkas `src/components/LoginPage.vue` dan salin seluruh isi komponen login dari _diff_.
4. Simpan perubahan, lalu jalankan `npm run dev` atau `npm run build` untuk memastikan aplikasi berjalan.

Dengan cara ini kamu bisa menyalin berkas lengkap tanpa kebingungan dengan tanda `+` di awal baris.
