<script>
  import { supabase } from './supabase.js'; // 👈 Menggunakan Supabase

  let email = "";
  let password = "";
  let errorMessage = "";
  let isLoading = false;

  async function handleLogin() {
    isLoading = true;
    errorMessage = "";
    try {
      // Proses Login ke Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      
    } catch (error) {
      errorMessage = "Akses Ditolak! Email atau Password salah.";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900 bg-opacity-95 backdrop-blur-sm">
  <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4 border-t-8 border-yellow-500">
    <div class="text-center mb-8">
      <h1 class="font-serif-satset text-4xl font-extrabold text-slate-900 mb-2">SATSET</h1>
      <p class="text-sm text-gray-500 font-bold uppercase tracking-widest">Klinik Demo Satset</p>
    </div>
    
    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-5">
        <label class="block text-sm font-bold mb-2 text-slate-900">Email Petugas</label>
        <input type="email" bind:value={email} required class="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-600" placeholder="contoh: admin@demo.com">
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-bold mb-2 text-slate-900">Password</label>
        <input type="password" bind:value={password} required class="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-600" placeholder="••••••••">
      </div>

      {#if errorMessage}
        <div class="mb-4 p-3 bg-red-100 text-red-600 text-xs font-bold rounded-lg text-center">{errorMessage}</div>
      {/if}

      <div class="mb-4 p-3 bg-blue-50 border border-blue-100 text-blue-800 text-xs rounded-lg text-center font-medium">
        Gunakan <b>admin@demo.com</b> dan sandi <b>admindemo123</b> untuk masuk.
      </div>

      <button type="submit" disabled={isLoading} class="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg">
        {isLoading ? 'Memproses...' : 'Buka Sistem SATSET'}
      </button>
    </form>
  </div>
</div>