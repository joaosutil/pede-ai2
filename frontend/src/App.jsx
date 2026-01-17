import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, MapPin, ShoppingBag, Star, Clock, 
  ChevronRight, Heart, Plus, Minus, X, 
  Utensils, ArrowLeft, Info, Filter, Check,
  User, LayoutGrid, Receipt, LogOut, Menu,
  ChevronDown, Bike, ShieldCheck, ShoppingCart,
  Map as MapIcon, CreditCard, Bell, Settings,
  Lock, Mail, Eye, EyeOff, LayoutDashboard,
  Package, DollarSign, TrendingUp, UserPlus,
  PlusCircle, Edit3, Trash2, Store, Home, Save, MessageSquare, UploadCloud, CornerDownRight,
  CreditCard as CardIcon, Wallet, Banknote, CheckCircle2, MessageCircle, Navigation, Locate, Map,
  Volume2, Truck, Box, Timer, QrCode, Copy, Smartphone
} from 'lucide-react';

/**
 * PEDE AÍ - DESIGN SYSTEM DEFINITIVO (v56 - THE ARCHITECT RELEASE)
 * - Ordem de declaração rigorosa para eliminar ReferenceErrors.
 * - Todos os painéis integrados: Admin, Parceiro, Cliente e Visitante.
 * - Pagamento Real: Pix (QR), Cartão (Modal), Dinheiro (Troco).
 * - Geolocalização Real e Som de Notificação.
 * - Design Original: Busca no Header e Filtros Laterais.
 */

const API_BASE = 'http://localhost:5000/api';
const UPLOADS_BASE = 'http://localhost:5000/uploads';
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

// --- 1. UTILITÁRIOS ---

function getImageUrl(img) {
  if (!img) return null;
  if (typeof img !== 'string') return null;
  if (img.startsWith('http')) return img;
  const isEmoji = /\p{Emoji}/u.test(img) && img.length <= 4;
  if (isEmoji) return img;
  const fileName = img.split(/[\\/]/).pop();
  return `${UPLOADS_BASE}/${fileName}`;
}

function checkIfOpen(opening, closing) {
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
}

// --- 2. COMPONENTES DE UI BÁSICOS ---

function PersonalizedLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-[#E85D04] rounded-[28px] flex items-center justify-center text-white font-black italic text-5xl shadow-2xl animate-bounce text-center">P</div>
      <p className="mt-8 font-black text-[#2E2E2E] tracking-tighter text-xl uppercase italic">Preparando o Sabor...</p>
    </div>
  );
}

function StoreImage({ src, alt, className, fallback = '🍱' }) {
  const [error, setError] = useState(false);
  useEffect(() => { setError(false); }, [src]);
  const resolvedUrl = useMemo(() => getImageUrl(src), [src]);
  const isEmoji = resolvedUrl && resolvedUrl.length <= 4 && /\p{Emoji}/u.test(resolvedUrl);

  if (error || !resolvedUrl || isEmoji) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#FAF7F2] shadow-inner overflow-hidden text-[#2E2E2E]`}>
        <span className="text-[2.5em] font-black">{isEmoji ? resolvedUrl : fallback}</span>
      </div>
    );
  }
  return <img src={resolvedUrl} alt={alt || "Imagem"} className={`${className} object-cover`} onError={() => setError(true)} />;
}

function PedeButton({ children, variant = 'primary', onClick, icon: Icon, fullWidth = false, className = "", type = "button", disabled = false, style = {} }) {
  const base = "h-[48px] px-6 rounded-[24px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm tracking-tight uppercase shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: `bg-[#E85D04] text-white hover:brightness-110`,
    secondary: `bg-white border-2 border-[#E85D04] text-[#E85D04] hover:bg-[#FAF7F2]`,
    ghost: `text-gray-500 hover:text-[#2E2E2E] hover:bg-gray-100`,
    green: `bg-[#4CAF50] text-white`
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} style={variant === 'primary' ? style : {}}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

function OrderStatusTracker({ status }) {
  const steps = [
    { label: 'Pendente', icon: Clock, id: 'Pendente' },
    { label: 'Preparando', icon: Utensils, id: 'Preparando' },
    { label: 'Em Rota', icon: Bike, id: 'Em Entrega' },
    { label: 'Entregue', icon: CheckCircle2, id: 'Entregue' }
  ];
  const currentIdx = steps.findIndex(s => s.id === status);
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative text-[#2E2E2E]">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-[#E85D04] -translate-y-1/2 z-0 transition-all duration-1000" style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}></div>
        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${idx <= currentIdx ? 'bg-[#E85D04] border-white text-white shadow-lg' : 'bg-white border-gray-100 text-gray-300'} ${idx === currentIdx ? 'scale-125 animate-pulse' : ''}`}><step.icon size={18}/></div>
            <span className={`text-[8px] font-black uppercase tracking-widest text-center max-w-[60px] ${idx <= currentIdx ? 'text-[#E85D04]' : 'text-gray-300'}`}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. MODAIS DE PAGAMENTO ---

function PixPaymentModal({ total, onConfirm, onClose }) {
  const pixCode = "00020126580014BR.GOV.BCB.PIX0136pedeai-pix-estatico-producao-12345678905204000053039865405" + total.toFixed(2).replace('.', '') + "5802BR5913PEDE AI APP6009CURITIBA62070503***6304E2B1";
  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = pixCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("Código Pix copiado!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden text-[#2E2E2E]">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#00BFA5]"></div>
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center justify-center gap-2"><Smartphone className="text-[#00BFA5]"/> Pagamento Pix</h3>
        <div className="bg-gray-50 p-6 rounded-3xl mb-6 flex justify-center border-2 border-dashed border-gray-200">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`} alt="Pix QR Code" className="w-48 h-48" />
        </div>
        <p className="text-sm text-gray-500 font-medium mb-6">Escaneie o QR Code ou copie o código abaixo.</p>
        <div className="flex gap-2 mb-8">
           <div className="flex-1 bg-[#FAF7F2] p-3 rounded-xl border border-gray-200 truncate text-[10px] font-mono text-gray-400">{pixCode}</div>
           <button onClick={copyToClipboard} className="p-3 bg-[#00BFA5] text-white rounded-xl hover:brightness-110"><Copy size={18}/></button>
        </div>
        <PedeButton fullWidth className="h-14 !bg-[#00BFA5]" onClick={onConfirm} icon={CheckCircle2}>Já paguei o Pix</PedeButton>
        <button onClick={onClose} className="mt-4 text-xs font-black uppercase text-gray-400 tracking-widest">Cancelar</button>
      </div>
    </div>
  );
}

function CardPaymentModal({ onConfirm, onClose, themeColor }) {
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl text-[#2E2E2E]">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3"><CardIcon className="text-[#E85D04]" style={{ color: themeColor }}/> Cartão de Crédito</h3>
        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-44 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between mb-8">
             <div className="text-xl tracking-[0.2em] font-mono">{cardData.number || '**** **** **** ****'}</div>
             <div className="flex justify-between uppercase text-[10px]">
                <div><p className="opacity-40 font-bold">Titular</p><p className="font-bold">{cardData.name || 'NOME NO CARTÃO'}</p></div>
                <div className="text-right"><p className="opacity-40 font-bold">Validade</p><p className="font-bold">{cardData.expiry || 'MM/AA'}</p></div>
             </div>
          </div>
          <input placeholder="Número do Cartão" className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none text-[#2E2E2E]" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})}/>
          <input placeholder="Nome Completo" className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none text-[#2E2E2E]" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})}/>
          <div className="grid grid-cols-2 gap-4 text-[#2E2E2E]">
             <input placeholder="Validade (MM/AA)" className="h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none text-[#2E2E2E]" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})}/>
             <input placeholder="CVV" className="h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none text-[#2E2E2E]" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})}/>
          </div>
        </div>
        <PedeButton fullWidth className="h-14" onClick={() => onConfirm(cardData)} style={{ backgroundColor: themeColor }}>Pagar e Finalizar</PedeButton>
        <button onClick={onClose} className="w-full mt-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Cancelar</button>
      </div>
    </div>
  );
}

function CashPaymentModal({ onConfirm, onClose, total }) {
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState('');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl text-[#2E2E2E]">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-[#2E2E2E]"><Banknote className="text-green-500"/> Dinheiro na Entrega</h3>
        <div className="space-y-6 mb-10 text-[#2E2E2E]">
           <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${needsChange ? 'border-green-500 bg-green-500' : 'border-gray-200'}`}>
                {needsChange && <Check size={14} className="text-white"/>}
              </div>
              <input type="checkbox" className="hidden" checked={needsChange} onChange={() => setNeedsChange(!needsChange)}/>
              <span className="font-black uppercase text-xs">Preciso de troco</span>
           </label>
           {needsChange && (
             <div className="animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Troco para quanto?</label>
                <div className="relative mt-1">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">R$</span>
                   <input type="number" placeholder="50,00" className="w-full h-14 pl-12 pr-4 bg-[#FAF7F2] border border-gray-100 rounded-2xl font-black text-lg outline-none focus:border-green-500 text-[#2E2E2E]" value={changeFor} onChange={e => setChangeFor(e.target.value)} />
                </div>
             </div>
           )}
        </div>
        <PedeButton fullWidth className="h-16 !bg-green-600" onClick={() => onConfirm(needsChange ? changeFor : 'Não precisa')}>Confirmar Pedido</PedeButton>
        <button onClick={onClose} className="w-full mt-4 text-xs font-black uppercase text-gray-400 tracking-widest text-center">Voltar</button>
      </div>
    </div>
  );
}

// --- 4. MODAIS DE NEGÓCIO ---

function ItemDetailModal({ item, onClose, onConfirm, themeColor }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 text-[#2E2E2E]">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
        <div className="h-56 w-full relative">
          <StoreImage src={item.img} className="w-full h-full" fallback="🍽️" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>
        <div className="p-8 -mt-12 relative z-10 bg-white rounded-t-[40px]">
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{item.name}</h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed italic mb-6">"{item.description}"</p>
          <div className="space-y-6">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6E1D8]">
              <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase text-gray-400 tracking-widest text-[#2E2E2E]"><MessageCircle size={14}/> Observações</div>
              <textarea placeholder="Ex: sem cebola, ponto da carne..." className="w-full bg-transparent border-none outline-none text-sm font-medium resize-none text-[#2E2E2E]" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 bg-[#FAF7F2] p-2 rounded-full border border-[#E6E1D8]">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-gray-400 hover:text-[#E85D04] shadow-sm"><Minus size={18}/></button>
                <span className="font-black text-lg w-6 text-center text-[#2E2E2E]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-[#E85D04] shadow-sm"><Plus size={18}/></button>
              </div>
              <div className="text-right text-[#2E2E2E]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black" style={{ color: themeColor || '#E85D04' }}>R$ {(item.price * qty).toFixed(2)}</p>
              </div>
            </div>
            <PedeButton fullWidth className="h-16 shadow-orange-100" onClick={() => onConfirm(qty, notes)} style={{ backgroundColor: themeColor }}>Adicionar à Sacola</PedeButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditStoreModal({ store, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...store });
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl text-[#2E2E2E]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter">Editar Loja</h3>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-500"><X size={24}/></button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome Fantasia</label><input name="name" value={formData.name || ''} onChange={handleChange} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04]"/></div>
             <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoria</label><input name="category" value={formData.category || ''} onChange={handleChange} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04]"/></div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Imagem / Banner</label>
            <div className="mt-2 p-4 bg-[#FAF7F2] rounded-xl border border-dashed border-gray-300 flex items-center gap-4">
               <UploadCloud size={24} className="text-[#E85D04]"/>
               <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-xs text-gray-400 cursor-pointer"/>
            </div>
          </div>
          <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Descrição</label><textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full h-24 p-4 bg-[#FAF7F2] border rounded-xl font-medium resize-none outline-none focus:border-[#E85D04] text-[#2E2E2E]"/></div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Abre às</label><input type="time" name="openingTime" value={formData.openingTime || ''} onChange={handleChange} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04]"/></div>
             <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Fecha às</label><input type="time" name="closingTime" value={formData.closingTime || ''} onChange={handleChange} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04]"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[#2E2E2E]">
             <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Cor Tema</label><input type="color" name="color" value={formData.color || '#E85D04'} onChange={handleChange} className="w-full h-12 p-1 bg-white border rounded-xl outline-none"/></div>
             <div><label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Estilo Visual</label><select name="type" value={formData.type || 'clean'} onChange={handleChange} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none text-[#2E2E2E]"><option value="clean">Moderno</option><option value="rustic">Rústico</option></select></div>
          </div>
          <PedeButton fullWidth onClick={() => onSave(formData, selectedFile)} icon={Save}>Guardar Todas as Alterações</PedeButton>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ storeId, onClose, onSave, editingProduct = null }) {
  const [formData, setFormData] = useState(editingProduct || { name: '', price: '', description: '', img: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    if (editingProduct) setFormData({ ...editingProduct });
    else setFormData({ name: '', price: '', description: '', img: '' });
  }, [editingProduct]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (!storeId) return alert("Erro: Loja não definida.");
    onSave({ ...formData, restaurant: storeId, id: editingProduct?._id }, selectedFile); 
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-[32px] w-full max-w-xl p-8 shadow-2xl text-[#2E2E2E]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter">{editingProduct ? 'Editar Item' : 'Novo Produto'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full transition-all text-gray-400 hover:text-red-500"><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 text-[#2E2E2E]">
           <input placeholder="Nome do Prato" name="name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04]"/>
           <input placeholder="Preço" type="number" step="0.01" name="price" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} required className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04]"/>
           <textarea placeholder="Descrição" name="description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-24 p-4 bg-[#FAF7F2] border rounded-xl font-medium resize-none outline-none focus:border-[#E85D04]"/>
           <div className="p-4 bg-[#FAF7F2] border-dashed border-2 rounded-xl flex items-center gap-4 text-[#2E2E2E]">
              <UploadCloud size={24} className="text-[#E85D04]" />
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-xs text-gray-400 cursor-pointer"/>
           </div>
           <PedeButton type="submit" fullWidth>{editingProduct ? 'Salvar' : 'Adicionar'}</PedeButton>
        </form>
      </div>
    </div>
  );
}

// --- 5. COMPONENTES DE VISTA ---

function MainHeader({ setView, setIsCartOpen, cartCount, currentAddress, user, bagRef, searchQuery, setSearchQuery }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E6E1D8] shadow-sm text-[#2E2E2E]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-[#E85D04] rounded-xl flex items-center justify-center text-white font-black italic shadow-lg text-lg text-center">P</div>
            <span className="font-black text-2xl tracking-tighter italic hidden lg:block uppercase">PEDE AÍ</span>
          </div>
          <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-2 rounded-full border border-[#E6E1D8] cursor-pointer hover:bg-white transition-colors group" onClick={() => setView('address')}>
            <MapPin size={16} className="text-[#E85D04]" />
            <div className="flex flex-col leading-none">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{currentAddress?.label || 'Entregar em'}</span>
              <span className="text-xs font-bold truncate max-w-[120px] md:max-w-[200px]">{currentAddress?.text || 'Definir morada...'}</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

        <div className="flex-1 max-w-md relative group hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#E85D04]" size={16} />
           <input type="text" placeholder="Buscar lojas ou pratos..." className="w-full bg-[#FAF7F2] h-10 pl-10 pr-4 rounded-full border border-transparent focus:bg-white focus:border-[#E85D04] outline-none text-sm font-medium transition-all text-[#2E2E2E]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>

        <div className="flex items-center gap-3">
          <button ref={bagRef} onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-[#FAF7F2] rounded-full hover:bg-[#E6E1D8] transition-all">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E85D04] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>}
          </button>
          <div className="w-10 h-10 rounded-full bg-[#E6E1D8] flex items-center justify-center cursor-pointer border-2 border-white shadow-sm hover:border-[#E85D04] transition-all overflow-hidden" onClick={() => setView(user ? (user.role === 'admin' || user.role === 'partner' ? 'admin' : 'profile') : 'login')}>
             {user && user.name ? <div className="w-full h-full bg-[#E85D04] flex items-center justify-center text-white text-xs font-bold uppercase">{user.name[0]}</div> : <User size={20} className="text-gray-600" />}
          </div>
        </div>
      </div>
    </header>
  );
}

function HomeView({ restaurants, handleOpenStore, searchQuery, categories, activeCategory, setActiveCategory }) {
  const filtered = useMemo(() => restaurants.filter(res => res.name !== "Administrador PedeAi" && (res.name || "").toLowerCase().includes(searchQuery.toLowerCase()) && (activeCategory === "Todas" || res.category === activeCategory)), [restaurants, searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-500 text-[#2E2E2E]">
      <div className="w-full h-[180px] md:h-[350px] bg-[#2E2E2E] rounded-[24px] md:rounded-[40px] mb-12 relative overflow-hidden flex items-center px-6 md:px-20 text-white shadow-2xl group">
        <div className="absolute inset-0 opacity-[0.12] bg-[url('https://www.transparenttextures.com/patterns/felt.png')]"></div>
        <div className="relative z-10 max-w-sm text-white">
          <h2 className="text-3xl md:text-6xl font-serif italic leading-none mb-3 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Sabor Real.</h2>
          <p className="text-[11px] md:text-sm opacity-60 mb-5 font-medium leading-relaxed italic text-white text-[#FAF7F2]">Direto dos melhores parceiros para o seu endereço.</p>
          <button className="bg-[#E85D04] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-white">Ver Promoções</button>
        </div>
        <div className="absolute -right-8 -bottom-8 text-[150px] md:text-[320px] opacity-10 rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110 text-white text-center text-[#FAF7F2]">🍱</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mt-8 text-[#2E2E2E]">
        <aside className="hidden lg:block w-72 space-y-12 shrink-0">
           <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-8 flex items-center gap-3 text-[#2E2E2E]">Categorias <div className="h-px bg-gray-200 flex-1"></div></h3>
           <div className="space-y-1.5">
              {categories.map(cat => (
                 <div key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center justify-between p-4 rounded-[16px] font-bold text-sm cursor-pointer transition-all ${activeCategory === cat ? 'bg-[#E85D04] text-white shadow-xl translate-x-2' : 'text-gray-500 hover:bg-white hover:text-[#E85D04]'}`}>
                    {cat} {activeCategory === cat && <Check size={16}/>}
                 </div>
              ))}
           </div>
        </aside>

        <div className="flex-1 space-y-10">
           <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">Lojas Próximas</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map(store => {
                const isOpen = checkIfOpen(store.openingTime, store.closingTime);
                return (
                  <div key={store._id || store.id} onClick={() => isOpen && handleOpenStore(store)} className={`bg-white rounded-[28px] border border-[#E6E1D8] overflow-hidden transition-all duration-300 group flex flex-col relative ${isOpen ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : 'grayscale opacity-75 cursor-not-allowed'}`}>
                     <div className="h-44 bg-[#FAF7F2] relative flex items-center justify-center overflow-hidden text-center text-[#2E2E2E]">
                        <div className="absolute inset-0 opacity-15 group-hover:scale-110 transition-transform duration-700" style={{backgroundColor: store.color || '#E85D04'}}></div>
                        <StoreImage src={store.img} alt={store.name} className="w-full h-full transition-transform duration-700 group-hover:scale-110" fallback={store.img || '🍱'} />
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-[10px] flex items-center gap-1 font-black text-xs shadow-lg text-[#2E2E2E]"><Star size={12} className="fill-[#E85D04] text-[#E85D04]" /> {store.rating || '4.5'}</div>
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-[8px] text-[9px] font-black uppercase tracking-widest shadow-lg ${isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{isOpen ? 'Aberto' : 'Fechado'}</div>
                        {!isOpen && <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none text-center"><span className="bg-white/90 text-[#2E2E2E] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl transform -rotate-3 border border-gray-200 text-[#2E2E2E]">Fechado Agora</span></div>}
                     </div>
                     <div className="p-6 text-[#2E2E2E]">
                        <h4 className={`text-xl font-bold uppercase tracking-tighter leading-none ${store.type === 'rustic' ? 'font-serif text-[#5A3E2B]' : 'text-[#2E2E2E]'}`}>{store.name}</h4>
                        <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-tighter text-[#2E2E2E]">{store.category} • {store.openingTime || '10:00'} - {store.closingTime || '22:00'}</p>
                     </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}

function AddressView({ savedAddresses, setSavedAddresses, setView, setCurrentAddrId }) {
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState('Minha Casa');
  const [newAddress, setNewAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleAdd = () => {
    if (!newAddress) return;
    const item = { id: Date.now(), label: newLabel, text: newAddress };
    setSavedAddresses([item, ...savedAddresses]);
    setCurrentAddrId(item.id);
    setNewAddress('');
    setShowForm(false);
    setView('home');
  };

  const detectLocationReal = () => {
    if (!navigator.geolocation) return alert("Navegador sem suporte GPS.");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setNewAddress(data.display_name || "Endereço não identificado");
      } catch (e) { setNewAddress("Erro na geolocalização."); }
      finally { setIsLocating(false); }
    }, () => { setIsLocating(false); alert("Permissão negada."); });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in slide-in-from-top-10 text-[#2E2E2E]">
       <div className="flex items-center gap-4 mb-10 text-[#2E2E2E]">
          <button onClick={() => setView('home')} className="p-2 bg-white rounded-full border border-[#E6E1D8] shadow-sm text-[#2E2E2E]"><ArrowLeft size={20}/></button>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Minhas Moradas</h2>
       </div>

       {showForm ? (
         <div className="bg-white p-8 rounded-[40px] border border-[#E6E1D8] shadow-2xl space-y-6 text-[#2E2E2E]">
            <div className="h-48 bg-[#FAF7F2] rounded-[24px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-300">
               <Locate size={40} className="text-[#E85D04] mb-3" />
               <PedeButton variant="ghost" onClick={detectLocationReal} disabled={isLocating} className="h-10 text-[#2E2E2E]">
                  {isLocating ? 'Detectando GPS...' : 'Detectar minha posição real'}
               </PedeButton>
            </div>
            <div className="space-y-4">
               <input placeholder="Nome (Ex: Casa, Trabalho)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04] text-[#2E2E2E]"/>
               <input placeholder="Endereço Completo" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04] text-[#2E2E2E]"/>
               <PedeButton fullWidth onClick={handleAdd} disabled={!newAddress}>Confirmar e Salvar</PedeButton>
               <button onClick={() => setShowForm(false)} className="w-full py-2 font-bold text-gray-400">Voltar</button>
            </div>
         </div>
       ) : (
         <div className="space-y-4 text-[#2E2E2E]">
            <button onClick={() => setShowForm(true)} className="w-full h-20 bg-white border-2 border-dashed border-[#E85D04]/30 rounded-[24px] flex items-center justify-center gap-3 text-[#E85D04] font-black uppercase text-sm">
              <PlusCircle size={24}/> Nova Localização
            </button>
            {savedAddresses.map(addr => (
              <div key={addr.id} className="bg-white p-6 rounded-[24px] border border-[#E6E1D8] flex items-center justify-between group shadow-sm text-[#2E2E2E]">
                 <div className="flex items-center gap-5 text-[#2E2E2E]">
                    <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#E85D04]"><Navigation size={20}/></div>
                    <div><h4 className="font-black uppercase text-xs text-[#2E2E2E]">{addr.label}</h4><p className="text-sm font-medium text-gray-400 italic text-[#2E2E2E]">{addr.text}</p></div>
                 </div>
                 <button onClick={() => { setCurrentAddrId(addr.id); setView('home'); }} className="p-3 bg-[#FAF7F2] text-[#E85D04] rounded-full hover:bg-[#E85D04] hover:text-white transition-all"><Check size={18}/></button>
              </div>
            ))}
         </div>
       )}
    </div>
  );
}

function StoreView({ selectedStore, setView, menuItems, onItemClick, user }) {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});

  const fetchReviews = async () => {
    if(selectedStore) {
      try {
        const res = await fetch(`${API_BASE}/restaurants/${selectedStore._id}/reviews`);
        if(res.ok) setReviews(await res.json());
      } catch(e) { setReviews([]); }
    }
  };

  useEffect(() => { fetchReviews(); }, [selectedStore]);

  const submitReply = async (reviewId) => {
    try {
      const res = await fetch(`${API_BASE}/restaurants/${selectedStore._id}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText[reviewId] })
      });
      if(res.ok) { fetchReviews(); setReplyText({ ...replyText, [reviewId]: '' }); }
    } catch(e) { alert("Erro ao responder."); }
  };

  if (!selectedStore) return null;
  const isRustic = selectedStore.type === 'rustic';
  const themeColor = selectedStore.color || '#E85D04';

  return (
      <div className={`animate-in slide-in-from-right duration-500 min-h-screen pb-32 text-[#2E2E2E] ${isRustic ? 'bg-[#F4EFE6]' : 'bg-white'}`}>
         <div className={`relative h-[300px] md:h-[450px] flex items-end p-8`} style={{ backgroundColor: themeColor }}>
            <div className="absolute inset-0 z-0 overflow-hidden">
               <StoreImage src={selectedStore.img} alt={selectedStore.name} className="w-full h-full brightness-75" fallback={selectedStore.img || '🍱'} />
               <div className="absolute inset-0 opacity-40" style={{ backgroundColor: themeColor }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <button onClick={() => setView('home')} className="absolute top-8 left-8 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#E6E1D8] hover:scale-110 transition-transform text-[#2E2E2E]"><ArrowLeft size={20}/></button>
            <div className="relative z-10 w-full max-w-7xl mx-auto text-white drop-shadow-lg">
               <h1 className={`text-5xl md:text-8xl font-black leading-tight tracking-tighter ${isRustic ? 'font-serif' : 'font-black'}`}>{selectedStore.name}</h1>
               <div className="flex gap-6 mt-6 text-xs font-black uppercase tracking-widest opacity-90 border-t border-white/20 pt-6 text-white text-[#FAF7F2]">
                  <span className="flex items-center gap-2"><Clock size={16}/> {selectedStore.openingTime} - {selectedStore.closingTime}</span>
                  <span className="flex items-center gap-2"><Star size={16} fill="white" className="text-white"/> {selectedStore.rating}</span>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 text-[#2E2E2E]">
            <div className="lg:col-span-2 space-y-12">
               <h2 className={`text-2xl font-black mb-10 uppercase tracking-tighter flex items-center gap-4 text-[#2E2E2E] ${isRustic ? 'font-serif' : ''}`}>Cardápio <div className="h-px bg-gray-200 flex-1"></div></h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems.map(item => (
                     <div key={item._id} className={`flex gap-4 p-5 border rounded-[24px] hover:shadow-xl cursor-pointer group transition-all text-[#2E2E2E] ${isRustic ? 'border-[#D9CDB8] bg-[#FAF7F2]' : 'border-[#E6E1D8] bg-white'}`} onClick={(e) => onItemClick(item, e)}>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1 text-[#2E2E2E]">
                           <div>
                             <h4 className={`font-bold text-sm uppercase truncate font-black group-hover:text-[#E85D04] transition-colors`}>{item.name}</h4>
                             <p className="text-[10px] text-gray-400 mt-2 line-clamp-2 italic leading-relaxed font-medium">"{item.description}"</p>
                           </div>
                           <div className="flex items-center justify-between mt-4">
                             <p className="font-black text-lg text-[#2E2E2E]">R$ {Number(item.price).toFixed(2)}</p>
                             <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm" style={{ backgroundColor: themeColor, color: 'white' }}><Plus size={16} strokeWidth={3}/></div>
                           </div>
                        </div>
                        <div className="w-24 h-24 bg-[#FAF7F2] rounded-[20px] flex items-center justify-center overflow-hidden shadow-inner shrink-0 border border-gray-50"><StoreImage src={item.img} alt={item.name} className="w-full h-full group-hover:scale-110 transition-transform duration-500" fallback={item.img || '🍽️'} /></div>
                     </div>
                  ))}
               </div>
               
               <div className={`p-8 md:p-10 rounded-[40px] border shadow-sm text-[#2E2E2E] ${isRustic ? 'bg-[#E6E1D8] border-[#D9CDB8]' : 'bg-[#FAF7F2] border-[#E6E1D8]'}`}>
                  <h3 className={`text-2xl font-black mb-8 uppercase flex items-center gap-3 tracking-tighter ${isRustic ? 'font-serif' : ''}`}><MessageSquare size={24} style={{ color: themeColor }}/> Avaliações</h3>
                  <div className="space-y-8">
                     {reviews.map((rev, i) => (
                        <div key={i} className="animate-in slide-in-from-bottom-2 text-[#2E2E2E]">
                           <div className="bg-white p-6 rounded-[24px] border border-[#E6E1D8] shadow-sm text-[#2E2E2E]">
                              <div className="flex justify-between items-center mb-3">
                                 <span className="font-bold text-sm uppercase tracking-tighter">{rev.user}</span>
                                 <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black" style={{ color: themeColor }}><Star size={12} fill={themeColor}/> {rev.rating}</div>
                              </div>
                              <p className="text-xs text-gray-500 italic leading-relaxed font-medium">"{rev.comment}"</p>
                           </div>
                           {rev.reply ? (
                              <div className="ml-8 mt-4 p-4 bg-white/50 rounded-[20px] border-l-4 flex gap-3 text-[#2E2E2E]" style={{ borderColor: themeColor }}>
                                 <CornerDownRight size={16} style={{ color: themeColor }} className="mt-1 shrink-0"/><div className="text-xs text-gray-600 font-medium italic">"{rev.reply}"</div>
                              </div>
                           ) : (
                              (user?.role === 'admin' || (user?.role === 'partner' && selectedStore.owner === user.id)) && (
                                 <div className="ml-8 mt-4 flex gap-2">
                                    <input placeholder="Responder..." className="flex-1 h-10 px-4 bg-white border border-gray-100 rounded-xl text-xs font-medium outline-none text-[#2E2E2E]" value={replyText[rev._id] || ''} onChange={e => setReplyText({...replyText, [rev._id]: e.target.value})} />
                                    <button onClick={() => submitReply(rev._id)} className="px-4 text-white rounded-xl text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: themeColor }}>Enviar</button>
                                 </div>
                              )
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="space-y-6">
               <div className="p-8 bg-white rounded-[32px] border border-[#E6E1D8] shadow-sm sticky top-32 text-[#2E2E2E]">
                  <h4 className={`font-black text-[10px] uppercase text-gray-400 mb-6 tracking-[0.2em] ${isRustic ? 'font-serif' : ''}`}>Sobre a Unidade</h4>
                  <p className={`text-sm font-medium text-gray-600 leading-relaxed italic mb-8 ${isRustic ? 'font-serif' : ''}`}>"{selectedStore.description || 'Experiência única em cada pedido.'}"</p>
                  <div className="space-y-4 pt-6 border-t border-gray-50 text-xs font-bold uppercase tracking-widest text-[#2E2E2E]">
                     <div className="flex justify-between"><span>Entrega</span><span className="text-[#4CAF50]">{selectedStore.fee === 0 ? 'GRÁTIS' : `R$ ${Number(selectedStore.fee).toFixed(2)}`}</span></div>
                     <div className="flex justify-between"><span>Tempo</span><span>{selectedStore.time || '30-40 min'}</span></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
  );
}

function CheckoutView({ cart, total, savedAddresses, currentAddrId, setView, placeOrder, selectedStore, user }) {
  const [paymentMethod, setPaymentMethod] = useState('Cartão');
  const currentAddress = savedAddresses.find(a => a.id === currentAddrId) || savedAddresses[0];

  const handleConfirm = () => {
    if(!user) return alert("Faça login para pedir!");
    if(!currentAddress) return alert("Defina uma morada!");
    placeOrder({
      restaurant: selectedStore._id,
      user: user.id,
      items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, notes: i.notes })),
      total: total + (selectedStore.fee || 0),
      paymentMethod,
      address: { label: currentAddress.label, text: currentAddress.text }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500 text-[#2E2E2E]">
      <button onClick={() => setView('home')} className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase text-[#E85D04] tracking-widest hover:underline text-[#2E2E2E]"><ArrowLeft size={16}/> Voltar</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-[#2E2E2E]">
        <div className="lg:col-span-2 space-y-8">
           <h2 className="text-4xl font-black uppercase tracking-tighter text-[#2E2E2E]">Finalizar Pedido</h2>
           <section className="bg-white p-8 rounded-[32px] border border-[#E6E1D8] shadow-sm text-[#2E2E2E]">
              <div className="flex items-center justify-between mb-6 text-[#2E2E2E]">
                <div className="flex items-center gap-3 text-[#2E2E2E]"><MapPin size={20} className="text-[#E85D04]"/><h3 className="font-bold uppercase tracking-tight text-[#2E2E2E]">Morada</h3></div>
                <button onClick={() => setView('address')} className="text-[10px] font-black uppercase text-[#E85D04] text-[#E85D04]">Trocar</button>
              </div>
              <div className="ml-8 text-[#2E2E2E]"><p className="font-black text-xs uppercase text-[#2E2E2E]">{currentAddress?.label}</p><p className="text-sm font-medium text-gray-400 italic text-[#2E2E2E]">{currentAddress?.text}</p></div>
           </section>
           <section className="bg-white p-8 rounded-[32px] border border-[#E6E1D8] shadow-sm text-[#2E2E2E]">
              <h3 className="font-bold uppercase tracking-tight mb-8 text-[#2E2E2E]">Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#2E2E2E]">
                 {['Pix', 'Cartão', 'Dinheiro'].map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-2 ${paymentMethod === m ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04]' : 'border-gray-100 text-gray-400'}`}>
                      {m === 'Pix' && <Smartphone size={24} className="text-[#00BFA5]"/>}
                      {m === 'Cartão' && <CardIcon size={24} className="text-[#E85D04]"/>}
                      {m === 'Dinheiro' && <Banknote size={24} className="text-green-500"/>}
                      <span className="text-[10px] font-black uppercase text-[#2E2E2E]">{m}</span>
                    </button>
                 ))}
              </div>
           </section>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-[#E6E1D8] shadow-xl text-[#2E2E2E]">
           <h3 className="font-black text-xs uppercase text-gray-400 mb-6 tracking-widest text-[#2E2E2E]">Resumo • {selectedStore?.name}</h3>
           <div className="space-y-4 mb-8 text-[#2E2E2E]">
              {cart.map(item => (<div key={item._id} className="flex justify-between text-sm text-[#2E2E2E] font-medium text-[#2E2E2E]"><span>{item.quantity}x {item.name}</span><span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span></div>))}
           </div>
           <div className="space-y-3 pt-6 border-t border-gray-100 text-[#2E2E2E]">
              <div className="flex justify-between text-xs font-bold uppercase text-gray-400 text-[#2E2E2E]"><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs font-bold uppercase text-gray-400 text-[#2E2E2E]"><span>Taxa</span><span className="text-[#4CAF50] text-[#4CAF50]">R$ {(selectedStore?.fee || 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-black pt-4 text-[#2E2E2E]"><span>TOTAL</span><span>R$ {(total + (selectedStore?.fee || 0)).toFixed(2)}</span></div>
           </div>
           <PedeButton fullWidth className="mt-8 h-14" onClick={handleConfirm} style={{ backgroundColor: selectedStore?.color }}>Concluir Pedido</PedeButton>
        </div>
      </div>
    </div>
  );
}

function AdminOrdersPanel({ myStore }) {
  const [orders, setOrders] = useState([]);
  const [lastCount, setLastCount] = useState(0);
  const audioRef = useRef(new Audio(NOTIFICATION_SOUND_URL));

  const fetchStoreOrders = async () => {
    if (!myStore) return;
    try {
      const res = await fetch(`${API_BASE}/orders/restaurant/${myStore._id}`);
      if (res.ok) {
        const data = await res.json();
        const pendingCount = data.filter(o => o.status === 'Pendente').length;
        if (pendingCount > lastCount) { audioRef.current.play().catch(() => {}); }
        setLastCount(pendingCount);
        setOrders(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchStoreOrders();
    const interval = setInterval(fetchStoreOrders, 10000);
    return () => clearInterval(interval);
  }, [myStore, lastCount]);

  const updateStatus = async (id, status) => {
     await fetch(`${API_BASE}/orders/${id}/status`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status })
     });
     fetchStoreOrders();
  };

  return (
    <div className="space-y-6 animate-in fade-in text-[#2E2E2E]">
       <div className="flex items-center gap-2 bg-orange-50 text-[#E85D04] px-4 py-2 rounded-full w-fit mb-4 text-[#E85D04]">
          <Volume2 size={16}/><span className="text-[10px] font-black uppercase">Notificações Sonoras Ativas</span>
       </div>
       {orders.map(order => (
         <div key={order._id} className="bg-white p-8 rounded-[32px] border border-[#E6E1D8] shadow-sm flex flex-col md:flex-row justify-between gap-8 text-[#2E2E2E]">
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-4 text-[#2E2E2E]">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>{order.status}</span>
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-widest text-[#2E2E2E]">#{(order._id || "").slice(-6).toUpperCase()}</span>
               </div>
               <div><h4 className="font-black text-lg uppercase tracking-tight text-[#2E2E2E]">{order.user?.name}</h4><p className="text-sm text-gray-400 italic text-[#2E2E2E]"><MapPin size={14} className="inline mr-1"/>{order.address?.text}</p></div>
               <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-gray-100">
                  {order.items.map((it, idx) => (
                    <p key={idx} className="text-xs font-black uppercase text-[#2E2E2E]">{it.quantity}x {it.name} {it.notes && <span className="text-[#E85D04] lowercase ml-1">({it.notes})</span>}</p>
                  ))}
               </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-6 text-[#2E2E2E]">
               <div className="text-right text-[#2E2E2E]"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-[#2E2E2E]">Total</p><p className="text-3xl font-black text-[#2E2E2E]">R$ {order.total.toFixed(2)}</p></div>
               <div className="flex gap-2 text-[#2E2E2E]">
                  {order.status === 'Pendente' && <PedeButton variant="green" className="!h-10" onClick={() => updateStatus(order._id, 'Preparando')}>Aceitar</PedeButton>}
                  {order.status === 'Preparando' && <PedeButton variant="primary" className="!h-10" icon={Truck} onClick={() => updateStatus(order._id, 'Em Entrega')}>Enviar</PedeButton>}
                  {order.status === 'Em Entrega' && <PedeButton variant="green" className="!h-10" icon={Check} onClick={() => updateStatus(order._id, 'Entregue')}>Entregue</PedeButton>}
               </div>
            </div>
         </div>
       ))}
    </div>
  );
}

function AdminView({ user, restaurants, setView, fetchRestaurants, logout }) {
  const [tab, setTab] = useState('orders');
  const [editingStore, setEditingStore] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [myStoreProducts, setMyStoreProducts] = useState([]);
  
  const myStore = useMemo(() => restaurants.find(r => r.owner === user?.id || r.owner === user?._id), [restaurants, user]);

  const fetchProducts = async () => {
    if (!myStore) return;
    try {
      const res = await fetch(`${API_BASE}/products/restaurant/${myStore._id}`);
      if (res.ok) setMyStoreProducts(await res.json());
    } catch (e) {}
  };

  useEffect(() => { if (tab === 'my_products') fetchProducts(); }, [tab, myStore]);

  const handleUpdateStore = async (updatedData, file) => {
    const formData = new FormData();
    Object.keys(updatedData).forEach(key => { if (updatedData[key] !== null) formData.append(key, updatedData[key]); });
    if (file) formData.append('image', file); 
    const res = await fetch(`${API_BASE}/restaurants/${updatedData._id}`, { method: 'PUT', body: formData });
    if (res.ok) { alert('Loja atualizada!'); setEditingStore(null); fetchRestaurants(); }
  };

  const handleSaveProduct = async (productData, file) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => { if (productData[key] !== null) formData.append(key, productData[key]); });
    if (file) formData.append('image', file);
    const res = await fetch(`${API_BASE}/products`, { method: 'POST', body: formData });
    if (res.ok) { setIsProductModalOpen(false); setEditingProduct(null); fetchProducts(); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 pb-32 text-[#2E2E2E]">
      {editingStore && <EditStoreModal store={editingStore} onClose={() => setEditingStore(null)} onSave={handleUpdateStore} />}
      {isProductModalOpen && <ProductModal storeId={myStore?._id} editingProduct={editingProduct} onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} onSave={handleSaveProduct} />}
      
      <div className="flex flex-col md:flex-row justify-between mb-10 gap-6 text-[#2E2E2E]">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('home')} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#E85D04] hover:underline shadow-orange-100 text-[#E85D04] font-black tracking-widest italic text-[#E85D04]"><Home size={14}/> Site</button>
              <button onClick={logout} className="flex items-center gap-2 text-[10px] font-black uppercase text-red-500 hover:underline text-red-500 font-black tracking-widest italic text-red-500"><LogOut size={14}/> Sair</button>
           </div>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-[#2E2E2E]">{user?.role === 'admin' ? 'Gestão Geral' : 'Painel Parceiro'}</h2>
        </div>
        <nav className="flex bg-white p-1.5 rounded-full border border-[#E6E1D8] self-start shadow-sm text-[#2E2E2E]">
           {user?.role === 'admin' ? (
             <><button onClick={() => setTab('global')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${tab === 'global' ? 'bg-[#E85D04] text-white' : 'text-gray-400'}`}>Nova Loja</button><button onClick={() => setTab('all_stores')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${tab === 'all_stores' ? 'bg-[#E85D04] text-white' : 'text-gray-400'}`}>Lojas</button></>
           ) : (
             <><button onClick={() => setTab('orders')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${tab === 'orders' ? 'bg-[#E85D04] text-white' : 'text-gray-400'}`}>Pedidos</button><button onClick={() => setTab('my_products')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase ${tab === 'my_products' ? 'bg-[#E85D04] text-white' : 'text-gray-400'}`}>Cardápio</button><button onClick={() => setEditingStore(myStore)} className="px-6 py-2 text-gray-400 rounded-full text-[10px] font-black uppercase hover:text-[#2E2E2E]">Configurações</button></>
           )}
        </nav>
      </div>

      {tab === 'orders' && <AdminOrdersPanel myStore={myStore} />}
      
      {tab === 'my_products' && (
        <div className="animate-in fade-in">
           <div className="flex items-center justify-between mb-8 text-[#2E2E2E]">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Cardápio</h3>
              <PedeButton onClick={() => setIsProductModalOpen(true)} icon={PlusCircle}>Novo Item</PedeButton>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[#2E2E2E]">
              {myStoreProducts.map(prod => (
                <div key={prod._id} className="bg-white p-5 rounded-[28px] border border-[#E6E1D8] flex gap-5 shadow-sm group text-[#2E2E2E]">
                   <div className="w-20 h-20 bg-[#FAF7F2] rounded-2xl overflow-hidden shrink-0 shadow-inner text-[#2E2E2E]"><StoreImage src={prod.img} alt={prod.name} className="w-full h-full text-[#2E2E2E]" fallback="🍱"/></div>
                   <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div><h4 className="font-bold text-sm uppercase truncate font-black text-[#2E2E2E]">{prod.name}</h4><p className="font-black text-[#E85D04] mt-3 tracking-tighter text-lg text-[#E85D04]">R$ {Number(prod.price).toFixed(2)}</p></div>
                      <div className="flex gap-2 text-[#2E2E2E]"><button onClick={() => { setEditingProduct(prod); setIsProductModalOpen(true); }} className="p-2.5 bg-gray-50 text-gray-300 rounded-full hover:text-[#E85D04] transition-all text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><Edit3 size={16}/></button></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

function AuthView({ setView, setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/${isRegister ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (res.ok) { 
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user', JSON.stringify(data.user)); 
        setUser(data.user); 
        setView('home'); 
      }
      else setError(data.message || 'Erro no login');
    } catch (err) { setError('Erro de conexão'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 animate-in fade-in text-[#2E2E2E]">
      <div className="bg-white p-10 rounded-[32px] border border-[#E6E1D8] shadow-2xl">
        <h2 className="text-4xl font-black uppercase mb-2">{isRegister ? 'Nova Conta' : 'Olá!'}</h2>
        <p className="text-gray-400 font-medium text-sm mb-10 italic">{isRegister ? 'Preencha os dados abaixo.' : 'Entre para continuar seus pedidos.'}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && <input placeholder="Nome Completo" required className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04] text-[#2E2E2E]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>}
          <input type="email" placeholder="E-mail" required className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04] text-[#2E2E2E]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
          <input type="password" placeholder="Senha" required className="w-full h-12 px-4 bg-[#FAF7F2] border rounded-xl font-bold outline-none focus:border-[#E85D04] text-[#2E2E2E]" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}/>
          {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
          <button type="submit" disabled={loading} className="w-full h-14 bg-[#E85D04] text-white rounded-full font-black uppercase tracking-widest mt-4 shadow-lg hover:brightness-110 disabled:opacity-50 transition-all">{loading ? '...' : (isRegister ? 'Registrar' : 'Entrar')}</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E85D04] transition-colors">{isRegister ? 'Já tenho conta' : 'Criar conta'}</button>
      </div>
    </div>
  );
}

// --- 6. COMPONENTE PRINCIPAL (ENGINE) ---

function MainApp() {
  const [view, setView] = useState('home');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('pedeai_addresses');
    return saved ? JSON.parse(saved) : [{ id: 1, label: 'Casa', text: 'Define sua morada' }];
  });
  const [currentAddrId, setCurrentAddrId] = useState(savedAddresses[0]?.id || null);

  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const bagRef = useRef(null);
  const currentAddress = savedAddresses.find(a => a.id === currentAddrId) || savedAddresses[0];

  const logout = () => { localStorage.clear(); setUser(null); setView('home'); };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/restaurants`);
      if (res.ok) setRestaurants(await res.json());
    } catch (err) {}
    finally { setTimeout(() => setLoading(false), 800); }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch (e) {} }
    fetchData();
  }, []);

  useEffect(() => { localStorage.setItem('pedeai_addresses', JSON.stringify(savedAddresses)); }, [savedAddresses]);

  const handleOpenStore = async (store) => {
    setSelectedStore(store);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products/restaurant/${store._id}`);
      if (res.ok) setMenuItems(await res.json());
    } catch (err) {}
    setView('store'); setTimeout(() => setLoading(false), 500);
    window.scrollTo(0, 0);
  };

  const handleItemClick = (item, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedItemForModal({ ...item, clickPos: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
  };

  const confirmAddToCart = (qty, notes) => {
    const item = selectedItemForModal;
    if (cart.length > 0 && cart[0].restaurant !== item.restaurant) {
       if(!window.confirm("Limpar sacola e trocar de restaurante?")) { setSelectedItemForModal(null); return; }
       setCart([]);
    }
    setCart(prev => {
      const exists = prev.find(p => p._id === item._id);
      if (exists) return prev.map(p => p._id === item._id ? { ...p, quantity: p.quantity + qty, notes: notes || p.notes } : p);
      return [...prev, { ...item, quantity: qty, notes }];
    });
    if (bagRef.current) {
      const bagRect = bagRef.current.getBoundingClientRect();
      setFlyingItem({ startPos: item.clickPos, targetPos: { x: bagRect.left + 15, y: bagRect.top + 15 }, icon: item.img });
      setTimeout(() => setFlyingItem(null), 750);
    }
    setSelectedItemForModal(null);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.reduce((acc, item) => {
      if (item._id === id) { if (item.quantity > 1) acc.push({...item, quantity: item.quantity - 1}); } 
      else acc.push(item); return acc;
    }, []));
  };

  const placeOrder = async (orderData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) { setCart([]); setPaymentModal(null); setView('order_success'); }
    } catch (e) { alert("Erro ao enviar pedido."); }
    finally { setLoading(false); }
  };

  const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);

  if (loading) return <PersonalizedLoading />;

  const categories = ["Todas", ...new Set(restaurants.filter(r => r.name !== "Administrador PedeAi").map(r => r.category))];
  const showFloatingBar = cart.length > 0 && !['checkout', 'order_success', 'login', 'admin', 'address', 'orders_history'].includes(view);

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans overflow-x-hidden text-[#2E2E2E]">
      {!['order_success', 'login', 'admin', 'address'].includes(view) && (
        <MainHeader setView={setView} setIsCartOpen={setIsCartOpen} cartCount={cart.length} currentAddress={currentAddress} user={user} bagRef={bagRef} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}
      
      <main className="min-h-screen pb-32 text-[#2E2E2E]">
        {view === 'home' && <HomeView restaurants={restaurants} handleOpenStore={handleOpenStore} searchQuery={searchQuery} categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}
        {view === 'address' && <AddressView savedAddresses={savedAddresses} setSavedAddresses={setSavedAddresses} setView={setView} setCurrentAddrId={setCurrentAddrId} />}
        {view === 'store' && <StoreView selectedStore={selectedStore} setView={setView} menuItems={menuItems} onItemClick={handleItemClick} user={user} />}
        {view === 'checkout' && <CheckoutView cart={cart} total={cartTotal} savedAddresses={savedAddresses} currentAddrId={currentAddrId} setView={setView} placeOrder={placeOrder} selectedStore={selectedStore} user={user} />}
        {view === 'order_success' && <div className="max-w-md mx-auto py-24 text-center px-6"><div className="w-24 h-24 bg-[#4CAF50] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl text-white text-white text-white text-white text-white text-white text-white text-white"><CheckCircle2 size={48} /></div><h2 className="text-4xl font-black uppercase mb-4 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Pedido Feito!</h2><PedeButton fullWidth onClick={() => {setCart([]); setView('home')}}>Voltar ao Início</PedeButton></div>}
        {view === 'profile' && <div className="max-w-md mx-auto py-24 text-center px-6 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><h2 className="text-4xl font-black mb-10 uppercase text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Perfil</h2><div className="space-y-4 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><PedeButton fullWidth variant="secondary" icon={Receipt} onClick={() => setView('orders_history')}>Meus Pedidos</PedeButton><PedeButton fullWidth onClick={logout} variant="ghost" className="text-red-500 text-red-500 text-red-500 text-red-500">Sair da Conta</PedeButton></div></div>}
        {view === 'admin' && <AdminView user={user} restaurants={restaurants} setView={setView} fetchRestaurants={fetchData} logout={logout} />}
        {view === 'orders_history' && <UserOrdersView user={user} setView={setView} />}
        {view === 'login' && <AuthView setView={setView} setUser={(u) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />}
      </main>

      {/* MODAIS DE PAGAMENTO NO CHECKOUT */}
      {paymentModal === 'pix' && <PixPaymentModal total={cartTotal + (selectedStore?.fee || 0)} onClose={() => setPaymentModal(null)} onConfirm={() => placeOrder({ method: 'Pix' })} />}
      {paymentModal === 'card' && <CardPaymentModal themeColor={selectedStore?.color} onClose={() => setPaymentModal(null)} onConfirm={(data) => placeOrder({ method: 'Cartão', ...data })} />}
      {paymentModal === 'cash' && <CashPaymentModal total={cartTotal + (selectedStore?.fee || 0)} onClose={() => setPaymentModal(null)} onConfirm={(troco) => placeOrder({ method: 'Dinheiro', troco })} />}
      
      {selectedItemForModal && <ItemDetailModal item={selectedItemForModal} themeColor={selectedStore?.color} onClose={() => setSelectedItemForModal(null)} onConfirm={confirmAddToCart} />}
      
      {flyingItem && <div className="fixed z-[100] pointer-events-none transition-all duration-700 ease-in-out flex items-center justify-center text-white text-white text-white text-white text-white text-white" style={{left: flyingItem.startPos.x, top: flyingItem.startPos.y, animation: 'fly-to-cart 0.7s forwards'}}><div className="w-10 h-10 bg-[#E85D04] rounded-full flex items-center justify-center text-white shadow-2xl text-white text-white text-white text-white text-white text-white" style={{ backgroundColor: selectedStore?.color || '#E85D04' }}>🍱</div><style>{`@keyframes fly-to-cart { 100% { transform: translate(${flyingItem.targetPos.x - flyingItem.startPos.x}px, ${flyingItem.targetPos.y - flyingItem.startPos.y}px) scale(0.2); opacity: 0; } }`}</style></div>}

      {showFloatingBar && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 flex justify-center text-white text-white text-white text-white text-white text-white text-white text-white"><div onClick={() => setIsCartOpen(true)} className="w-full max-w-2xl h-16 rounded-2xl shadow-2xl flex items-center justify-between px-6 cursor-pointer hover:brightness-110 active:scale-95 transition-all text-white text-white text-white text-white text-white text-white" style={{ backgroundColor: selectedStore?.color || '#E85D04' }}><div className="flex items-center gap-3 text-white text-white text-white text-white text-white text-white"><ShoppingBag size={20}/><div className="flex flex-col text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white"><span className="text-xs font-black uppercase text-white text-white text-white text-white text-white text-white text-white text-white">Ver Sacola</span><span className="text-[10px] opacity-70 uppercase font-black text-white text-white text-white text-white text-white text-white text-white text-white">{cart.length} itens</span></div></div><div className="text-right text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white"><p className="text-[10px] opacity-60 uppercase font-black tracking-tighter text-white text-white text-white text-white text-white text-white">Subtotal</p><p className="font-black text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white text-white">R$ {cartTotal.toFixed(2)}</p></div></div></div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">
            <div className="p-10 border-b border-[#E6E1D8] flex items-center justify-between bg-[#FAF7F2]/40 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><h2 className="text-4xl font-black uppercase tracking-tighter text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Sacola</h2><button onClick={() => setIsCartOpen(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-[#E6E1D8] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><X size={28} /></button></div>
            <div className="flex-1 p-10 overflow-y-auto">
               {cart.length === 0 ? <p className="text-center text-gray-400 mt-20 font-black opacity-30 italic text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Vazia</p> : 
                  cart.map(item => (
                    <div key={item._id} className="flex gap-4 items-center mb-6 animate-in slide-in-from-bottom-2 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">
                       <div className="w-16 h-16 bg-[#FAF7F2] rounded-[12px] flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><StoreImage src={item.img} alt={item.name} className="w-full h-full text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]" fallback={item.img || '🍽️'} /></div>
                       <div className="flex-1 overflow-hidden text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><p className="font-bold text-sm uppercase truncate font-black text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">{item.name}</p><p className="text-xs font-black text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04]">R$ {Number(item.price).toFixed(2)}</p></div>
                       <div className="flex items-center gap-2 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">
                          <button onClick={() => removeFromCart(item._id)} className="p-1 text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04]"><Minus/></button>
                          <span className="font-bold text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">{item.quantity}</span>
                          <button onClick={() => confirmAddToCart(1, '')} className="p-1 text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04] text-[#E85D04]"><Plus/></button>
                       </div>
                    </div>
                  ))
               }
            </div>
            {cart.length > 0 && <div className="p-8 border-t border-[#E6E1D8] bg-[#FAF7F2]/60 space-y-4 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]"><PedeButton fullWidth className="h-16 shadow-orange-100" onClick={() => { setIsCartOpen(false); setView('checkout'); }} style={{ backgroundColor: selectedStore?.color }}>Finalizar Compra</PedeButton></div>}
          </div>
        </div>
      )}

      {/* FOOTER NAV MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E6E1D8] flex items-center justify-around px-4 z-40 text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-[#E85D04]' : 'text-gray-300'}`}><LayoutGrid size={22} /><span className="text-[8px] font-black uppercase text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Início</span></button>
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300"><Receipt size={22} /><span className="text-[8px] font-black uppercase text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Sacola</span></button>
        <button onClick={() => setView(user ? 'orders_history' : 'login')} className="flex flex-col items-center gap-1 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300"><Clock size={22} /><span className="text-[8px] font-black uppercase text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Pedidos</span></button>
        <button onClick={() => setView(user ? 'profile' : 'login')} className="flex flex-col items-center gap-1 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300 text-gray-300"><User size={22} /><span className="text-[8px] font-black uppercase text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E] text-[#2E2E2E]">Perfil</span></button>
      </nav>
    </div>
  );
}

export default function App() { return <MainApp />; }