import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, MapPin, ShoppingBag, Star, Clock, 
  ChevronRight, Heart, Plus, Minus, X, 
  Utensils, ArrowLeft, Info, Filter, Check,
  User, LayoutGrid, Receipt, LogOut, Menu,
  ChevronDown, Bike, ShieldCheck, ShoppingCart,
  Map as MapIcon, CreditCard, Bell, Settings,
  Lock, Mail, Eye, EyeOff, LayoutDashboard,
  Package, DollarSign, TrendingUp, UserPlus,
  PlusCircle, Edit3, Trash2, Store
} from 'lucide-react';

/**
 * PEDE AÍ - DESIGN SYSTEM DEFINITIVO (v11 - STABLE REFERENCE FIX)
 * Correções: MainHeader e outros componentes definidos antes do uso.
 */

const API_BASE = 'http://localhost:5000/api';
const UPLOADS_BASE = 'http://localhost:5000/uploads';

// --- UTILS ---
const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  const isEmoji = /\p{Emoji}/u.test(img) && img.length <= 4;
  return isEmoji ? img : `${UPLOADS_BASE}/${img}`;
};

const checkIfOpen = (opening, closing) => {
  if (!opening || !closing) return true;
  try {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = opening.split(':').map(Number);
    const [closeH, closeM] = closing.split(':').map(Number);
    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;
    if (closeTime < openTime) return currentTime >= openTime || currentTime <= closeTime;
    return currentTime >= openTime && currentTime <= closeTime;
  } catch (e) { return true; }
};

// --- COMPONENTES ATÔMICOS ---

const PedeButton = ({ children, variant = 'primary', onClick, icon: Icon, fullWidth = false, className = "", type = "button", disabled = false }) => {
  const base = "h-[48px] px-6 rounded-[24px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm tracking-tight uppercase shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: `bg-[#E85D04] text-white hover:brightness-110`,
    secondary: `bg-white border-2 border-[#E85D04] text-[#E85D04] hover:bg-[#FAF7F2]`,
    ghost: `text-gray-500 hover:text-[#2E2E2E] hover:bg-gray-100`,
    green: `bg-[#4CAF50] text-white`
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- COMPONENTES DE INTERFACE (DECLARADOS ANTES DO APP) ---

const MainHeader = ({ setView, setIsCartOpen, cartCount, address, searchQuery, setSearchQuery, user }) => (
  <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E6E1D8] shadow-sm">
    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-[#E85D04] rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">P</div>
          <span className="font-black text-2xl tracking-tighter italic hidden lg:block text-[#2E2E2E]">PEDE AÍ</span>
        </div>
        
        <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-2 rounded-full border border-[#E6E1D8] cursor-pointer hover:bg-white transition-colors group" onClick={() => setView('address')}>
          <MapPin size={16} className="text-[#E85D04]" />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Entregar em</span>
            <span className="text-xs font-bold text-[#2E2E2E] truncate max-w-[100px] md:max-w-[200px]">{address}</span>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      <div className="flex-1 max-w-md relative group hidden md:block">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E85D04]" size={16} />
         <input 
           type="text" 
           placeholder="Buscar lojas ou pratos..." 
           className="w-full bg-[#FAF7F2] h-10 pl-10 pr-4 rounded-full border border-transparent focus:bg-white focus:border-[#E85D04] outline-none text-sm font-medium transition-all"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-[#FAF7F2] rounded-full text-[#2E2E2E] hover:bg-[#E6E1D8] transition-all group">
          <ShoppingBag size={22} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E85D04] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-short">{cartCount}</span>}
        </button>
        <div className="w-10 h-10 rounded-full bg-[#E6E1D8] flex items-center justify-center cursor-pointer border-2 border-white shadow-sm hover:border-[#E85D04] transition-all overflow-hidden" onClick={() => setView(user ? (user.role === 'admin' || user.role === 'partner' ? 'admin' : 'profile') : 'login')}>
           {user && user.name ? <div className="w-full h-full bg-[#E85D04] flex items-center justify-center text-white text-xs font-bold uppercase">{user.name[0]}</div> : <User size={20} className="text-gray-600" />}
        </div>
      </div>
    </div>
  </header>
);

const HomeView = ({ restaurants, activeCategory, setActiveCategory, handleOpenStore, categories }) => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 animate-in fade-in duration-500">
    <div className="w-full h-[180px] md:h-[350px] bg-[#2E2E2E] rounded-[24px] md:rounded-[40px] mb-8 relative overflow-hidden flex items-center px-6 md:px-20 text-white shadow-2xl group">
      <div className="absolute inset-0 opacity-[0.12] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
      <div className="relative z-10 max-w-sm">
        <h2 className="text-3xl md:text-6xl font-serif italic leading-none mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Sabor Real.</h2>
        <p className="text-[11px] md:text-sm opacity-60 mb-5 font-medium leading-relaxed italic">Direto dos melhores chefs para a sua mesa.</p>
        <button className="bg-[#E85D04] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Ver Promoções</button>
      </div>
      <div className="absolute -right-8 -bottom-8 text-[150px] md:text-[320px] opacity-10 rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110">🥗</div>
    </div>

    <div className="flex flex-col lg:flex-row gap-12 mt-8">
      <aside className="hidden lg:block w-72 space-y-12 shrink-0">
         <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-8 flex items-center gap-3">Categorias <div className="h-px bg-gray-200 flex-1"></div></h3>
            <div className="space-y-1.5">
               {categories.map(cat => (
                  <div 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center justify-between p-4 rounded-[16px] font-bold text-sm cursor-pointer transition-all ${activeCategory === cat ? 'bg-[#E85D04] text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-white hover:text-[#E85D04]'}`}
                  >
                     {cat} {activeCategory === cat && <Check size={16}/>}
                  </div>
               ))}
            </div>
         </div>
      </aside>

      <div className="flex-1 space-y-10">
         <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-[#2E2E2E]">Lojas Próximas</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {restaurants.map(store => {
              const isOpen = checkIfOpen(store.openingTime, store.closingTime);
              const imgUrl = getImageUrl(store.img);
              
              return (
                <div key={store._id || store.id} onClick={() => handleOpenStore(store)} className={`bg-white rounded-[28px] border border-[#E6E1D8] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col ${!isOpen ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                   <div className="h-44 bg-[#FAF7F2] relative flex items-center justify-center text-6xl overflow-hidden text-center">
                      {imgUrl && imgUrl.includes('http') ? (
                        <img src={imgUrl} alt={store.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <span className="relative z-10 group-hover:rotate-6 transition-transform duration-500">{imgUrl || '🍱'}</span>
                      )}
                      
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-[10px] flex items-center gap-1 font-black text-xs shadow-lg">
                        <Star size={12} className="fill-[#E85D04] text-[#E85D04]" /> {store.rating || '4.5'}
                      </div>

                      {!isOpen && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <span className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Fechado agora</span>
                        </div>
                      )}
                   </div>
                   <div className="p-6">
                      <h4 className={`text-xl font-bold uppercase tracking-tighter leading-none ${store.type === 'rustic' ? 'font-serif text-[#5A3E2B]' : ''}`}>{store.name}</h4>
                      <p className="text-xs text-gray-400 mt-2 font-bold uppercase">{store.category} • {store.openingTime || '11:00'} às {store.closingTime || '23:00'}</p>
                   </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  </div>
);

const AddressView = ({ addressInput, setAddressInput, setAddress, setView }) => (
  <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 animate-in slide-in-from-top-10 duration-700">
     <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('home')} className="p-2 bg-white rounded-full border border-[#E6E1D8] active:scale-90 transition-all shadow-sm"><ArrowLeft size={20}/></button>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none text-[#2E2E2E]">Onde entregar?</h2>
     </div>
     <div className="relative mb-16">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24}/>
        <input 
          type="text" 
          placeholder="Rua, número e cidade..." 
          className="w-full h-16 pl-16 pr-20 bg-white border border-[#E6E1D8] rounded-[24px] shadow-2xl focus:ring-4 focus:ring-[#E85D04]/10 focus:border-[#E85D04] outline-none font-bold text-lg transition-all text-[#2E2E2E]"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
           <button 
              onClick={() => { if(addressInput) { setAddress(addressInput); setView('home'); }}}
              className="p-3 bg-[#E85D04] text-white rounded-[16px] shadow-lg hover:brightness-110 active:scale-90 transition-all disabled:opacity-30"
              disabled={!addressInput}
           >
              <Check size={24} strokeWidth={3} />
           </button>
        </div>
     </div>
  </div>
);

const AuthView = ({ setView, setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setView('home');
      } else {
        setError(data.message || 'Erro na autenticação');
      }
    } catch (err) {
      setError('Servidor indisponível no momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 animate-in fade-in duration-700">
      <div className="bg-white p-10 rounded-[32px] border border-[#E6E1D8] shadow-2xl">
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 text-[#2E2E2E]">{isRegister ? 'Criar Conta' : 'Olá!'}</h2>
        <p className="text-gray-400 font-medium text-sm mb-10 leading-relaxed">
          {isRegister ? 'Preencha os dados abaixo para se juntar ao Pede Aí.' : 'Faça login para continuar seus pedidos favoritos.'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
              <input 
                type="text" placeholder="Nome Completo" required
                className="w-full h-12 pl-12 pr-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04] transition-all"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
            <input 
              type="email" placeholder="E-mail" required
              className="w-full h-12 pl-12 pr-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04] transition-all"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
            <input 
              type="password" placeholder="Senha" required
              className="w-full h-12 pl-12 pr-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04] transition-all"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="text-xs text-red-500 font-bold ml-1 bg-red-50 p-2 rounded-lg">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full h-14 bg-[#E85D04] text-white rounded-full font-black uppercase tracking-widest mt-4 shadow-lg hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {loading ? 'Processando...' : (isRegister ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        <button 
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E85D04] transition-colors"
        >
          {isRegister ? 'Já tenho conta? Fazer Login' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
};

const AdminView = ({ user, restaurants, setView, fetchRestaurants }) => {
  const [tab, setTab] = useState(user?.role === 'admin' ? 'global' : 'my_store');
  const [newStore, setNewStore] = useState({ ownerName: '', email: '', password: '', restaurantName: '', category: 'Pizza' });

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/admin/setup-restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Restaurante e Acesso criados com sucesso!');
        setNewStore({ ownerName: '', email: '', password: '', restaurantName: '', category: 'Pizza' });
        fetchRestaurants();
      } else {
        alert(data.message || 'Erro ao criar loja.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-[#2E2E2E]">
            {user?.role === 'admin' ? 'Gestão Pede Aí' : 'Portal do Parceiro'}
          </h2>
          <p className="text-gray-400 font-medium">{user?.role === 'admin' ? 'Administração Geral do Ecossistema' : 'Gerencie seu restaurante'}</p>
        </div>
        
        <nav className="flex bg-white p-1.5 rounded-full border border-[#E6E1D8] shadow-sm overflow-x-auto no-scrollbar">
          {user?.role === 'admin' ? (
            <>
              <button onClick={() => setTab('global')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${tab === 'global' ? 'bg-[#E85D04] text-white shadow-lg' : 'text-gray-400'}`}>Criar Loja</button>
              <button onClick={() => setTab('all_stores')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${tab === 'all_stores' ? 'bg-[#E85D04] text-white shadow-lg' : 'text-gray-400'}`}>Todas as Lojas</button>
            </>
          ) : (
            <>
              <button onClick={() => setTab('my_store')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${tab === 'my_store' ? 'bg-[#E85D04] text-white shadow-lg' : 'text-gray-400'}`}>Meu Cardápio</button>
              <button onClick={() => setTab('orders')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${tab === 'orders' ? 'bg-[#E85D04] text-white shadow-lg' : 'text-gray-400'}`}>Pedidos</button>
            </>
          )}
        </nav>
      </div>

      {tab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[40px] border border-[#E6E1D8] shadow-2xl">
             <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Ativar Novo Parceiro</h3>
             <form onSubmit={handleCreateStore} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Responsável</label>
                    <input type="text" required value={newStore.ownerName} onChange={e => setNewStore({...newStore, ownerName: e.target.value})} className="w-full h-12 px-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04]" placeholder="Nome do Dono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome da Loja</label>
                    <input type="text" required value={newStore.restaurantName} onChange={e => setNewStore({...newStore, restaurantName: e.target.value})} className="w-full h-12 px-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04]" placeholder="Ex: Burguer King" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">E-mail de Login</label>
                  <input type="email" required value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} className="w-full h-12 px-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04]" placeholder="email@parceiro.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Senha Inicial</label>
                  <input type="password" required value={newStore.password} onChange={e => setNewStore({...newStore, password: e.target.value})} className="w-full h-12 px-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-[16px] outline-none font-bold text-sm focus:border-[#E85D04]" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full h-16 bg-[#E85D04] text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all">Configurar Restaurante</button>
             </form>
          </div>
          <div className="bg-[#2E2E2E] p-10 rounded-[40px] text-white flex flex-col justify-center relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Administrador<br/>Geral</h4>
                <p className="text-gray-400 text-sm max-w-xs mb-8">Você está no comando do ecossistema. Crie lojas, gerencie parceiros e acompanhe o crescimento.</p>
                <div className="flex gap-4">
                   <div className="p-4 bg-white/10 rounded-2xl"><p className="text-[10px] font-black text-gray-500 uppercase">Lojas</p><p className="text-xl font-black">{restaurants.length}</p></div>
                   <div className="p-4 bg-white/10 rounded-2xl"><p className="text-[10px] font-black text-gray-500 uppercase">Status</p><p className="text-xl font-black text-green-400">Online</p></div>
                </div>
             </div>
             <div className="absolute -right-12 -bottom-12 text-[200px] opacity-5 rotate-12">🛡️</div>
          </div>
        </div>
      )}

      {tab === 'my_store' && (
        <div className="animate-in slide-in-from-right duration-500">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Meu Cardápio</h3>
              <button className="flex items-center gap-2 px-6 h-12 bg-[#E85D04] text-white rounded-full font-black text-xs uppercase shadow-lg active:scale-95 transition-all">
                <PlusCircle size={18}/> Novo Produto
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2].map(i => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-[#E6E1D8] flex gap-6 shadow-sm hover:shadow-xl transition-all group relative">
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-[#4CAF50] uppercase mb-2 tracking-widest italic">Item Ativo</p>
                      <h4 className="font-bold text-lg uppercase tracking-tighter">Produto Exemplo {i}</h4>
                      <p className="text-2xl font-black text-[#2E2E2E] mt-4">R$ 29,90</p>
                      <div className="flex gap-2 mt-6">
                         <button className="p-2.5 bg-[#FAF7F2] text-gray-400 rounded-full hover:text-[#E85D04] transition-colors"><Edit3 size={16}/></button>
                         <button className="p-2.5 bg-[#FAF7F2] text-gray-400 rounded-full hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                   </div>
                   <div className="w-24 h-24 bg-[#FAF7F2] rounded-[20px] flex items-center justify-center text-5xl border border-gray-100">🍕</div>
                </div>
              ))}
              <div className="border-2 border-dashed border-[#E6E1D8] rounded-[32px] flex flex-col items-center justify-center p-10 text-gray-400 group cursor-pointer hover:border-[#E85D04] transition-colors">
                 <PlusCircle size={32} className="mb-4 group-hover:text-[#E85D04] transition-colors"/>
                 <span className="font-black text-[10px] uppercase tracking-widest">Adicionar Item</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StoreView = ({ selectedStore, setView, menuItems, addToCart }) => {
  if (!selectedStore) return null;
  return (
      <div className="animate-in slide-in-from-bottom-full duration-700 bg-white min-h-screen">
         <div className={`relative h-[300px] md:h-[550px] flex items-end p-8 md:p-24 ${selectedStore.type === 'rustic' ? 'bg-[#E6E1D8]' : 'bg-[#FAF7F2]'}`}>
            {selectedStore.type === 'rustic' && <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>}
            <button onClick={() => setView('home')} className="absolute top-8 left-8 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-[#E6E1D8] hover:scale-110 transition-all active:scale-95">
              <ArrowLeft size={24} />
            </button>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
               <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="px-4 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-black/5 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#4CAF50]"/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Loja Oficial</span>
                     </div>
                  </div>
                  <h1 className={`text-6xl md:text-9xl font-bold leading-[0.8] tracking-tighter ${selectedStore.type === 'rustic' ? 'font-serif text-[#5A3E2B]' : 'text-[#2E2E2E]'}`} style={{fontFamily: selectedStore.type === 'rustic' ? 'Playfair Display' : 'Poppins'}}>{selectedStore.name}</h1>
                  <p className="text-sm md:text-xl mt-8 opacity-60 font-medium leading-relaxed max-w-md italic">{selectedStore.description}</p>
               </div>
               <div className="bg-white/80 backdrop-blur-xl px-10 py-6 rounded-[32px] shadow-2xl border border-[#E6E1D8] text-center min-w-[140px]">
                  <div className="text-4xl font-black flex items-center justify-center gap-2 text-[#2E2E2E]">
                     <Star size={28} className="fill-[#E85D04] text-[#E85D04]" /> {selectedStore.rating || '4.8'}
                  </div>
                  <span className="text-[11px] font-black text-gray-400 uppercase mt-2 block tracking-widest">Avaliações</span>
               </div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {menuItems.map(item => {
                 const pImg = getImageUrl(item.img);
                 return (
                    <div key={item._id} className="flex gap-6 p-6 rounded-[28px] border border-[#E6E1D8] bg-white hover:border-[#E85D04]/30 transition-all cursor-pointer group shadow-sm" onClick={() => addToCart(item)}>
                       <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                             <h4 className="font-bold text-lg uppercase tracking-tighter text-[#2E2E2E] group-hover:text-[#E85D04] transition-colors">{item.name}</h4>
                             <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                          <span className="font-black text-xl mt-4 tracking-tight">R$ {Number(item.price || 0).toFixed(2)}</span>
                       </div>
                       <div className="w-24 h-24 bg-[#FAF7F2] rounded-[20px] flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                          {pImg && pImg.includes('http') ? (
                            <img src={pImg} className="w-full h-full object-cover" alt={item.name} />
                          ) : (
                            <span className="text-4xl">{pImg || '🍱'}</span>
                          )}
                       </div>
                    </div>
                 );
               })}
            </div>
         </div>
      </div>
  );
};

const ProfileView = ({ user, setView, logout }) => (
  <div className="max-w-3xl mx-auto px-6 py-16 animate-in fade-in duration-500">
     <button onClick={() => setView('home')} className="mb-12 flex items-center gap-3 font-black text-[10px] text-[#E85D04] uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"><ArrowLeft size={16}/> Voltar</button>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-1 text-center">
           <div className="w-32 h-32 rounded-[40px] bg-[#E6E1D8] flex items-center justify-center text-gray-500 border-4 border-white shadow-2xl mx-auto mb-6 relative group overflow-hidden">
              {user?.name ? <span className="text-4xl font-black uppercase text-gray-400">{user.name[0]}</span> : <User size={56}/>}
           </div>
           <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">{user?.name || 'Usuário'}</h2>
           <p className="text-xs font-bold text-gray-400 mt-2 italic">{user?.email}</p>
        </div>

        <div className="md:col-span-2 space-y-4">
           {[
             { n: 'Meus Pedidos', i: Receipt, c: 'Acompanhe suas entregas' },
             { n: 'Endereços Salvos', i: MapIcon, c: 'Gerenciar locais' },
             { n: 'Configurações', i: Settings, c: 'Dados da conta' }
           ].map(opt => (
             <div key={opt.n} className="flex items-center justify-between p-6 bg-white rounded-[24px] border border-[#E6E1D8] hover:shadow-xl hover:border-[#E85D04]/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                   <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-gray-400 group-hover:text-[#E85D04] transition-colors"><opt.i size={20}/></div>
                   <div>
                      <p className="font-bold text-sm text-[#2E2E2E] uppercase tracking-tight leading-none mb-1.5">{opt.n}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{opt.c}</p>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-200 group-hover:text-[#E85D04] group-hover:translate-x-1 transition-all"/>
             </div>
           ))}
           <button className="w-full mt-10 h-16 flex items-center justify-center gap-3 font-black text-red-500 uppercase text-[10px] tracking-[0.3em] hover:bg-red-50 rounded-full transition-all border border-transparent hover:border-red-100" onClick={logout}><LogOut size={18}/> Sair do Sistema</button>
        </div>
     </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [view, setView] = useState('home');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState(() => localStorage.getItem('userAddress') || "Defina seu endereço...");
  const [addressInput, setAddressInput] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/restaurants`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setRestaurants(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) { localStorage.removeItem('user'); }
    }
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('home');
  };

  // Regra: O Admin Geral nunca aparece como restaurante
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(res => {
      const isNotPlatformAdmin = res.name !== "Administrador PedeAi";
      const matchCategory = activeCategory === "Todas" || res.category === activeCategory;
      const matchSearch = (res.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      return isNotPlatformAdmin && matchCategory && matchSearch;
    });
  }, [restaurants, activeCategory, searchQuery]);

  const categories = useMemo(() => {
    const cats = restaurants
      .filter(r => r.name !== "Administrador PedeAi")
      .map(r => r.category)
      .filter(Boolean);
    return ["Todas", ...new Set(cats)];
  }, [restaurants]);

  const handleOpenStore = async (store) => {
    setSelectedStore(store);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/restaurant/${store._id}`).catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setMenuItems(Array.isArray(data) ? data : []);
      }
    } catch (err) { }
    setView('store');
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(p => p._id === item._id);
      if (exists) return prev.map(p => p._id === item._id ? {...p, quantity: p.quantity + 1} : p);
      return [...prev, {...item, quantity: 1}];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item._id === id) {
        if (item.quantity > 1) acc.push({...item, quantity: item.quantity - 1});
      } else acc.push(item);
      return acc;
    }, []));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-[#E85D04] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2E2E2E] font-sans selection:bg-[#E85D04]/10 overflow-x-hidden">
      {view !== 'store' && view !== 'address' && view !== 'login' && view !== 'admin' && view !== 'profile' && (
        <MainHeader 
          setView={setView} 
          setIsCartOpen={setIsCartOpen} 
          cartCount={cart.length} 
          address={address}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
        />
      )}
      
      <main className="min-h-screen">
        {view === 'home' && (
           <HomeView 
            restaurants={filteredRestaurants} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory}
            handleOpenStore={handleOpenStore}
            categories={categories}
          />
        )}
        {view === 'address' && (
          <AddressView 
            addressInput={addressInput} 
            setAddressInput={setAddressInput} 
            setAddress={(addr) => { setAddress(addr); localStorage.setItem('userAddress', addr); }}
            setView={setView}
          />
        )}
        {view === 'login' && <AuthView setView={setView} setUser={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />}
        {view === 'admin' && <AdminView user={user} restaurants={restaurants} setView={setView} fetchRestaurants={fetchData} />}
        {view === 'profile' && <ProfileView user={user} setView={setView} logout={logout} />}
        {view === 'store' && <StoreView selectedStore={selectedStore} setView={setView} menuItems={menuItems} addToCart={addToCart} />}
      </main>

      {/* CARRINHO SIDEBAR */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
             <div className="p-10 border-b border-[#E6E1D8] flex items-center justify-between bg-[#FAF7F2]/40">
              <h2 className="text-4xl font-black tracking-tighter uppercase">Minha Sacola</h2>
              <button onClick={() => setIsCartOpen(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#E6E1D8] hover:text-red-500 transition-all shadow-xl"><X size={28} /></button>
            </div>
            <div className="flex-1 p-10 overflow-y-auto">
               {cart.length === 0 ? <p className="text-center text-gray-400 mt-20 font-black opacity-30 italic">Sacola Vazia</p> : 
                  cart.map(item => (
                    <div key={item._id} className="flex gap-4 items-center mb-6 animate-in slide-in-from-bottom-2">
                       <div className="w-16 h-16 bg-[#FAF7F2] rounded-[12px] flex items-center justify-center text-2xl overflow-hidden border border-gray-100 shadow-inner">
                          {getImageUrl(item.img) && getImageUrl(item.img).includes('http') ? (
                              <img src={getImageUrl(item.img)} className="w-full h-full object-cover" />
                          ) : item.img || '🍽️'}
                       </div>
                       <div className="flex-1"><p className="font-bold text-sm uppercase tracking-tight leading-none mb-1">{item.name}</p><p className="text-xs font-black text-[#E85D04]">R$ {Number(item.price).toFixed(2)}</p></div>
                       <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border border-gray-100 shadow-sm">
                          <button onClick={() => removeFromCart(item._id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Minus size={14}/></button>
                          <span className="font-black text-xs min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="p-1 text-[#E85D04] hover:text-[#4CAF50] transition-colors"><Plus size={14}/></button>
                       </div>
                    </div>
                  ))
               }
            </div>
            {cart.length > 0 && (
               <div className="p-8 border-t border-[#E6E1D8] bg-[#FAF7F2]/60 space-y-4">
                  <div className="flex justify-between font-black text-2xl">
                     <span>Total</span>
                     <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <PedeButton fullWidth className="!h-[64px] !text-lg">Finalizar Pedido Agora</PedeButton>
               </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E6E1D8] flex items-center justify-around px-4 z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-[#E85D04] -translate-y-1' : 'text-gray-300'}`}>
          <LayoutGrid size={22} />
          <span className="text-[8px] font-black uppercase tracking-tighter">Início</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300"><Search size={22} /><span className="text-[8px] font-black uppercase tracking-tighter">Busca</span></button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-300 relative">
            <Receipt size={22} />
            {cart.length > 0 && <span className="absolute top-0 right-2 w-2 h-2 bg-[#E85D04] rounded-full"></span>}
            <span className="text-[8px] font-black uppercase tracking-tighter">Sacola</span>
        </button>
        <button onClick={() => setView(user ? (user.role === 'admin' || user.role === 'partner' ? 'admin' : 'profile') : 'login')} className={`flex flex-col items-center gap-1 ${view === 'profile' || view === 'admin' || view === 'login' ? 'text-[#E85D04] -translate-y-1' : 'text-gray-300'}`}>
          {user && (user.role === 'admin' || user.role === 'partner') ? <LayoutDashboard size={22} /> : <User size={22} />}
          <span className="text-[8px] font-black uppercase tracking-tighter">{(user && (user.role === 'admin' || user.role === 'partner')) ? 'Painel' : 'Perfil'}</span>
        </button>
      </nav>
    </div>
  );
}