<script>
  import { onMount } from 'svelte';
  import { supabase } from './lib/supabase.js'; // 👈 Import Supabase di App.svelte
  
  import Login from './lib/Login.svelte';
  import Dashboard from './lib/Dashboard.svelte';
  import EBilling from './lib/EBilling.svelte'; 
  import Sbar from './lib/Sbar.svelte';
  import LaporanJaga from './lib/LaporanJaga.svelte';
  import Insiden from './lib/Insiden.svelte'; 
  import Riwayat from './lib/Riwayat.svelte';
  import Admin from './lib/Admin.svelte';
  import Visum from './lib/Visum.svelte';

  let user = null;
  let currentView = 'dashboard'; 
  
  let masterData = { identitas: [], kategori: {}, obat: [], kop: {} };
  const API_URL = import.meta.env.VITE_GAS_API_URL;

  onMount(() => {
    // 1. Cek apakah user sudah login sebelumnya
    supabase.auth.getSession().then(({ data: { session } }) => {
      user = session?.user || null;
      if(user && API_URL) muatMasterData();
      setTimeout(() => { if(window.lucide) window.lucide.createIcons(); }, 100);
    });

    // 2. Pantau perubahan (saat user klik Login atau Logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      user = session?.user || null;
      if(user && API_URL) muatMasterData();
      setTimeout(() => { if(window.lucide) window.lucide.createIcons(); }, 100);
    });
  });

  async function muatMasterData() {
    try {
      const response = await fetch(API_URL + "?action=getMasterData");
      const hasil = await response.json();
      if(hasil.status === "success") masterData = hasil.data;
    } catch (error) { console.error("Gagal ambil data database:", error); }
  }

  function switchView(target) {
    currentView = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { if(window.lucide) window.lucide.createIcons(); }, 50);
  }

  // 3. Fungsi Logout Supabase
  async function logout() {
    await supabase.auth.signOut();
  }

  // ==========================================
  // FITUR RAHASIA: RESET DEMO (12x TAP)
  // ==========================================
  let logoClickCount = 0;
  let logoClickTimer;

  async function handleLogoClick() {
    switchView('dashboard'); // Tetap jalankan fungsi aslinya (kembali ke beranda)
    
    logoClickCount++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 7000); 

    if (logoClickCount === 12) {
      logoClickCount = 0;
      await eksekusiResetDemo();
    }
  }

  async function eksekusiResetDemo() {
    const konfirmasi = confirm("⚠️ PROTOKOL RAHASIA DIAKTIFKAN ⚠️\n\nAnda mengetuk logo 12 kali. Yakin ingin MENGHAPUS SEMUA DATA PASIEN, SBAR, & STELING?");
    if (!konfirmasi) return;

    try {
      await Promise.all([
        supabase.from('laporan_pasien').delete().neq('id', 0),
        supabase.from('riwayat_sbar').delete().neq('id', 0),
        supabase.from('kendala_shift').delete().neq('id', 0),
        supabase.from('log_steling_obat').delete().neq('id', 0)
      ]);
      alert("✅ RESET BERHASIL! Semua data demo telah dibersihkan.");
      window.location.reload(); 
    } catch (error) {
      alert("❌ Gagal mereset data: " + error.message);
    }
  }

</script>

{#if !user}
  <Login />
{:else}
  <header class="h-20 flex items-center px-6 lg:px-12 border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm no-print">
<div on:click={handleLogoClick} class="flex items-center mr-8 cursor-pointer group select-none">
          <div class="w-10 h-10 bg-udemy-black text-white rounded-lg flex items-center justify-center mr-3 group-hover:bg-udemy-purple transition-colors">
              <i data-lucide="zap" class="w-6 h-6 fill-current"></i>
          </div>
          <h1 class="font-serif-satset text-3xl font-extrabold tracking-tight group-hover:text-udemy-purple transition-colors">SATSET</h1>
      </div>

      <div class="hidden md:flex flex-1 max-w-3xl relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i data-lucide="search" class="w-5 h-5 text-gray-400 group-focus-within:text-udemy-purple transition-colors"></i>
          </div>
          <input type="text" placeholder="Cari Aplikasi (misal: 'Billing', 'Laporan Jaga', 'SBAR')...." 
              class="w-full bg-udemy-light border border-gray-300 rounded-full py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-udemy-purple focus:border-transparent transition-all text-sm placeholder-gray-500">
      </div>

      <div class="flex items-center ml-auto space-x-6">
          <button on:click={() => switchView('dashboard')} class="hidden lg:block text-sm font-medium hover:text-udemy-purple transition-colors">Aplikasi Saya</button>
          
          <button on:click={() => switchView('app-admin')} class="hidden md:flex items-center text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <span class="material-icons text-sm mr-1">admin_panel_settings</span> Admin
          </button>

          <button on:click={logout} class="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center">
              <i data-lucide="log-out" class="w-4 h-4 mr-1"></i> Keluar
          </button>
      </div>
  </header>

  <div class="hidden md:flex justify-center space-x-8 py-3 shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)] text-sm text-udemy-gray bg-white relative z-40 no-print">
      <button on:click={() => switchView('dashboard')} class="hover:text-udemy-purple hover:font-bold transition-all">Semua Aplikasi</button>
      
      <button on:click={() => alert('Fitur ini dinonaktifkan di versi Demo untuk melindungi data rekam medis pasien yang asli.')} class="flex items-center text-emerald-600 hover:text-emerald-800 hover:font-bold transition-all">
          Pendaftaran & RM <span class="material-icons text-[12px] ml-1">open_in_new</span>
      </button>

      <button on:click={() => switchView('app-ebilling')} class="hover:text-udemy-purple hover:font-bold transition-all">Administrasi & Kasir</button>
      <button on:click={() => switchView('app-jaga-input')} class="hover:text-udemy-purple hover:font-bold transition-all">Operasional Shift</button>
      <button on:click={() => switchView('app-sbar')} class="hover:text-udemy-purple hover:font-bold transition-all">Form SBAR</button>
      <button on:click={() => switchView('app-insiden')} class="hover:text-udemy-purple hover:font-bold transition-all">Laporan Insiden</button>
      <button on:click={() => switchView('visum')} class="hover:text-red-600 hover:font-bold transition-all">Laporan Visum</button>
  </div>
  
  <main class="min-h-screen pb-20">
    
    {#if currentView === 'dashboard'}
      <Dashboard {switchView} />

    {:else if currentView === 'app-ebilling'}
      <EBilling {switchView} />

    {:else if currentView === 'app-jaga-input'}
      <LaporanJaga {switchView} activeTab="input" />

    {:else if currentView === 'app-jaga-rekap'}
      <LaporanJaga {switchView} activeTab="rekap" />

    {:else if currentView === 'app-sbar'}
      <Sbar {switchView} />

    {:else if currentView === 'contact'}
      <div class="p-10 text-center animate-fade-in">
        <h2 class="text-2xl font-bold text-navy">Pusat Bantuan (Sedang Proses Migrasi)</h2>
      </div>

    {:else if currentView === 'app-insiden'}
      <Insiden {switchView} />

    {:else if currentView === 'riwayat'} 
      <Riwayat {switchView} />

    {:else if currentView === 'app-admin'}
      <Admin {switchView} />

    {:else if currentView === 'visum'}
      <Visum {switchView} />
    
    {/if}

  </main>
{/if}