import React, { useState, useEffect } from 'react';
import { 
  Utensils, ChefHat, Receipt, BarChart3, Plus, Trash2, Edit3, 
  CheckCircle, AlertTriangle, Clock, Search, ShoppingBag, 
  DollarSign, X, Check, AlertCircle, Settings, Smartphone 
} from 'lucide-react';

const INITIAL_MENU = [
  { id: '1', name: 'Royal Gadbad', category: 'Desi Classics', price: 180, available: true, emoji: '🍨', desc: '3 scoops of ice cream layered with jelly, dry fruits & fresh fruits' },
  { id: '2', name: 'Fruit Salad with Ice Cream', category: 'Desi Classics', price: 140, available: true, emoji: '🥗', desc: 'Fresh seasonal chopped fruits topped with vanilla scoop & honey' },
  { id: '3', name: 'Classic Falooda', category: 'Desi Classics', price: 160, available: true, emoji: '🍧', desc: 'Vermicelli, sabja seeds, rose syrup, mixed dry fruits & kulfi ice cream' },
  { id: '4', name: 'Death by Chocolate (DBC)', category: 'Sundaes & Sizzlers', price: 240, available: true, emoji: '🍫', desc: 'Brownie chunks, chocolate ice cream, hot fudge and chocolate flakes' },
  { id: '5', name: 'Hot Chocolate Fudge (HCF)', category: 'Sundaes & Sizzlers', price: 190, available: true, emoji: '🔥', desc: 'Vanilla scoops smothered in piping hot homemade rich chocolate fudge' },
  { id: '6', name: 'Sizzling Brownie with Ice Cream', category: 'Sundaes & Sizzlers', price: 260, available: true, emoji: '🌋', desc: 'Fudgy walnut brownie on a hot iron sizzler plate topped with cold vanilla' },
  { id: '7', name: 'Tender Coconut Scoop', category: 'Scoops & Naturals', price: 90, available: true, emoji: '🥥', desc: 'Made with real tender coconut pulp and fresh cream' },
  { id: '8', name: 'Sitaphal (Custard Apple)', category: 'Scoops & Naturals', price: 110, available: true, emoji: '🍈', desc: 'Rich seasonal custard apple grain texture without artificial essence' },
  { id: '9', name: 'Alphonso Mango Scoop', category: 'Scoops & Naturals', price: 100, available: true, emoji: '🥭', desc: 'Ratnagiri Alphonso mango pulp blended into rich milk base' },
  { id: '10', name: 'Cold Coffee with Ice Cream', category: 'Thickshakes', price: 150, available: true, emoji: '🧋', desc: 'Blended cold coffee topped with a generous scoop of vanilla' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('waiter');
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('scoop_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('scoop_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderType, setOrderType] = useState('Dine-In');
  const [selectedTable, setSelectedTable] = useState('1');
  const [carNumber, setCarNumber] = useState('');
  const [cart, setCart] = useState([]);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [activeRunningTable, setActiveRunningTable] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('scoop_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('scoop_orders', JSON.stringify(orders));
  }, [orders]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio context restricted');
    }
  };

  const submitOrder = () => {
    if (cart.length === 0) return;
    playChime();
    const newOrder = {
      id: 'KOT-' + Math.floor(1000 + Math.random() * 9000),
      orderType,
      tableNo: orderType === 'Dine-In' ? selectedTable : (orderType === 'Car Service' ? `Car: ${carNumber || 'N/A'}` : 'Parcel'),
      items: cart.map((c, idx) => ({ ...c, cartId: Date.now() + idx, status: 'Preparing' })),
      timestamp: Date.now(),
      timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Preparing'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setCarNumber('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-pink-500 to-amber-400 p-2 rounded-xl text-slate-950 font-black">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Scoop & Utsav Ice Cream Parlour</h1>
            <p className="text-[11px] text-slate-400">POS & Kitchen Display System (KDS)</p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'waiter', label: 'Waiter POS', icon: Smartphone },
            { id: 'kitchen', label: 'Kitchen KDS', icon: ChefHat },
            { id: 'billing', label: 'Billing', icon: Receipt },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${activeTab === tab.id ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {activeTab === 'waiter' && (
          <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex space-x-2">
                {['Dine-In', 'Parcel', 'Car Service'].map(t => (
                  <button key={t} onClick={() => setOrderType(t)} className={`px-4 py-2 rounded-xl text-xs font-bold ${orderType === t ? 'bg-pink-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {menu.map(item => (
                  <div key={item.id} onClick={() => setCart([...cart, { item, qty: 1, size: 'Regular', cone: 'Cup', cartId: Date.now() }])} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 cursor-pointer hover:border-pink-500/50 transition-all">
                    <span className="text-2xl">{item.emoji}</span>
                    <h3 className="text-sm font-bold text-white mt-2">{item.name}</h3>
                    <p className="text-xs text-pink-400 font-bold mt-1">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Current KOT Pad</h3>
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-12">Tap menu items to add to order</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((c, i) => (
                      <div key={i} className="flex justify-between text-xs bg-slate-900 p-2.5 rounded-xl">
                        <span>{c.qty}x {c.item.name}</span>
                        <span className="text-pink-400 font-bold">₹{c.item.price * c.qty}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <button onClick={submitOrder} className="w-full bg-gradient-to-r from-pink-600 to-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs mt-4">
                  Send Order to Kitchen
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'kitchen' && (
          <div className="flex-1 p-4">
            <h2 className="text-sm font-bold text-white mb-4">Live Kitchen KDS Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orders.filter(o => o.status !== 'Paid').map(ord => (
                <div key={ord.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-white">{ord.id}</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{ord.tableNo}</span>
                  </div>
                  {ord.items.map(it => (
                    <div key={it.cartId} className="text-xs py-1 text-slate-300">
                      {it.qty}x {it.item.name}
                    </div>
                  ))}
                  <button onClick={() => setOrders(orders.map(o => o.id === ord.id ? { ...o, status: 'Ready' } : o))} className="w-full mt-4 bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs">
                    Mark Ready
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="flex-1 p-4">
            <h2 className="text-sm font-bold text-white mb-4">Cashier & Billing Counter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.filter(o => o.status !== 'Paid').map(ord => (
                <div key={ord.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-sm">{ord.id} ({ord.tableNo})</h3>
                    <p className="text-xs text-slate-400 mt-1">{ord.items.reduce((s, i) => s + (i.item.price * i.qty), 0)} INR</p>
                  </div>
                  <button onClick={() => setPaymentModalOrder(ord)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
                    Settle Bill
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 p-4">
            <h2 className="text-sm font-bold text-white mb-4">Business Analytics & Sales</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Orders</span>
                <p className="text-2xl font-black text-indigo-400 mt-1">{orders.length}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}