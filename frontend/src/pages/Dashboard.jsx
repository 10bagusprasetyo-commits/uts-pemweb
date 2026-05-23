import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

const MENUS = [
  { key: 'events', label: 'Events', icon: '📅' },
  { key: 'categories', label: 'Categories', icon: '🗂️' },
  { key: 'speakers', label: 'Speakers', icon: '🎤' },
  { key: 'users', label: 'Users', icon: '👤' },
  { key: 'biodata', label: 'Biodata', icon: '🪪' },
];

const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
  }}>
    <div style={{
      background: '#1e293b', borderRadius: 16, padding: 28, width: '100%',
      maxWidth: 480, border: '1px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#f1f5f9', fontWeight: 600 }}>{title}</h2>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#94a3b8', fontSize: 22,
          cursor: 'pointer', lineHeight: 1, padding: '0 4px'
        }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const FInput = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <input {...props} style={{
      width: '100%', padding: '10px 12px', background: '#0f172a',
      border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9',
      fontSize: 14, outline: 'none', boxSizing: 'border-box'
    }} />
  </div>
);

const FTextarea = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <textarea {...props} rows={3} style={{
      width: '100%', padding: '10px 12px', background: '#0f172a',
      border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9',
      fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box'
    }} />
  </div>
);

const FSelect = ({ label, children, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <select {...props} style={{
      width: '100%', padding: '10px 12px', background: '#0f172a',
      border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9',
      fontSize: 14, outline: 'none', boxSizing: 'border-box'
    }}>{children}</select>
  </div>
);

const Btn = ({ variant = 'primary', children, style, ...props }) => {
  const variants = {
    primary: { background: '#3b82f6', color: '#fff' },
    danger: { background: '#ef4444', color: '#fff' },
    ghost: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155' },
    warning: { background: '#f59e0b', color: '#fff' },
  };
  return (
    <button {...props} style={{
      padding: '8px 16px', borderRadius: 8, border: 'none',
      cursor: 'pointer', fontSize: 13, fontWeight: 500, ...variants[variant], ...(style || {})
    }}>{children}</button>
  );
};

const Badge = ({ children, color = '#3b82f6' }) => (
  <span style={{
    background: color + '22', color, fontSize: 11, fontWeight: 600,
    padding: '2px 8px', borderRadius: 99, border: `1px solid ${color}44`
  }}>{children}</span>
);

const Empty = ({ label }) => (
  <div style={{ textAlign: 'center', padding: '48px 0', color: '#475569' }}>
    <div style={{ fontSize: 36, marginBottom: 8 }}>🗃️</div>
    <p style={{ margin: 0 }}>Belum ada {label}</p>
  </div>
);

const Table = ({ headers, children }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          {headers.map(h => (
            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const TR = ({ children }) => (
  <tr style={{ borderBottom: '1px solid #1e293b' }}
    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    {children}
  </tr>
);

const TD = ({ children, style }) => (
  <td style={{ padding: '12px 14px', color: '#cbd5e1', verticalAlign: 'middle', ...style }}>{children}</td>
);

const EventsPanel = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', tanggal: '', categoryId: '', pembicaraId: '' });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [ev, cat, spk] = await Promise.all([
      axios.get('/events'), axios.get('/categories'), axios.get('/speakers')
    ]);
    setData(ev.data); setCategories(cat.data); setSpeakers(spk.data);
  };
  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditItem(null); setForm({ name: '', description: '', tanggal: '', categoryId: '', pembicaraId: '' }); setModal(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description, tanggal: item.tanggal.split('T')[0], categoryId: item.categoryId, pembicaraId: item.pembicaraId });
    setModal(true);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...form, categoryId: Number(form.categoryId), pembicaraId: Number(form.pembicaraId) };
      if (editItem) await axios.put(`/events/${editItem.id}`, payload);
      else await axios.post('/events', payload);
      setModal(false); fetchAll();
    } catch { alert('Gagal simpan!'); }
    finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus event ini?')) return;
    await axios.delete(`/events/${id}`); fetchAll();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 600 }}>Events</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{data.length} event terdaftar</p>
        </div>
        <Btn onClick={openCreate}>+ Tambah Event</Btn>
      </div>
      {data.length === 0 ? <Empty label="event" /> : (
        <Table headers={['ID', 'Nama Event', 'Tanggal', 'Category', 'Speaker', 'Aksi']}>
          {data.map(ev => (
            <TR key={ev.id}>
              <TD><Badge color="#6366f1">#{ev.id}</Badge></TD>
              <TD style={{ fontWeight: 500, color: '#f1f5f9' }}>{ev.name}</TD>
              <TD>{new Date(ev.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</TD>
              <TD><Badge color="#10b981">{ev.category?.name || '-'}</Badge></TD>
              <TD><Badge color="#f59e0b">{ev.pembicara?.name || ev.speaker?.name || '-'}</Badge></TD>
              <TD>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="warning" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEdit(ev)}>Edit</Btn>
                  <Btn variant="danger" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => handleDelete(ev.id)}>Hapus</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}
      {modal && (
        <Modal title={editItem ? 'Edit Event' : 'Tambah Event'} onClose={() => setModal(false)}>
          <FInput label="Nama Event" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama event..." />
          <FTextarea label="Deskripsi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi event..." />
          <FInput label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
          <FSelect label="Category" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">-- Pilih Category --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </FSelect>
          <FSelect label="Speaker" value={form.pembicaraId} onChange={e => setForm({ ...form, pembicaraId: e.target.value })}>
            <option value="">-- Pilih Speaker --</option>
            {speakers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </FSelect>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
            <Btn onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Btn>
          </div>
        </Modal>
      )}
    </>
  );
};

const CategoriesPanel = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => { const res = await axios.get('/categories'); setData(res.data); };
  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditItem(null); setForm({ name: '' }); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name }); setModal(true); };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editItem) await axios.put(`/categories/${editItem.id}`, form);
      else await axios.post('/categories', form);
      setModal(false); fetchAll();
    } catch { alert('Gagal simpan!'); }
    finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus category ini?')) return;
    await axios.delete(`/categories/${id}`); fetchAll();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 600 }}>Categories</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{data.length} category terdaftar</p>
        </div>
        <Btn onClick={openCreate}>+ Tambah Category</Btn>
      </div>
      {data.length === 0 ? <Empty label="category" /> : (
        <Table headers={['ID', 'Nama Category', 'Dibuat', 'Aksi']}>
          {data.map(item => (
            <TR key={item.id}>
              <TD><Badge color="#6366f1">#{item.id}</Badge></TD>
              <TD style={{ fontWeight: 500, color: '#f1f5f9' }}>{item.name}</TD>
              <TD>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TD>
              <TD>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="warning" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEdit(item)}>Edit</Btn>
                  <Btn variant="danger" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => handleDelete(item.id)}>Hapus</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}
      {modal && (
        <Modal title={editItem ? 'Edit Category' : 'Tambah Category'} onClose={() => setModal(false)}>
          <FInput label="Nama Category" value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="Nama category..." />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
            <Btn onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Btn>
          </div>
        </Modal>
      )}
    </>
  );
};

const SpeakersPanel = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', role: '' });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => { const res = await axios.get('/speakers'); setData(res.data); };
  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditItem(null); setForm({ name: '', role: '' }); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, role: item.role }); setModal(true); };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editItem) await axios.put(`/speakers/${editItem.id}`, form);
      else await axios.post('/speakers', form);
      setModal(false); fetchAll();
    } catch { alert('Gagal simpan!'); }
    finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Hapus speaker ini?')) return;
    await axios.delete(`/speakers/${id}`); fetchAll();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 600 }}>Speakers</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{data.length} speaker terdaftar</p>
        </div>
        <Btn onClick={openCreate}>+ Tambah Speaker</Btn>
      </div>
      {data.length === 0 ? <Empty label="speaker" /> : (
        <Table headers={['ID', 'Nama', 'Role', 'Dibuat', 'Aksi']}>
          {data.map(item => (
            <TR key={item.id}>
              <TD><Badge color="#6366f1">#{item.id}</Badge></TD>
              <TD style={{ fontWeight: 500, color: '#f1f5f9' }}>{item.name}</TD>
              <TD><Badge color="#8b5cf6">{item.role}</Badge></TD>
              <TD>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TD>
              <TD>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn variant="warning" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => openEdit(item)}>Edit</Btn>
                  <Btn variant="danger" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => handleDelete(item.id)}>Hapus</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      )}
      {modal && (
        <Modal title={editItem ? 'Edit Speaker' : 'Tambah Speaker'} onClose={() => setModal(false)}>
          <FInput label="Nama Speaker" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nama speaker..." />
          <FInput label="Role / Jabatan" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Contoh: Dosen, CEO, dll..." />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
            <Btn onClick={handleSubmit} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Btn>
          </div>
        </Modal>
      )}
    </>
  );
};

const UsersPanel = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('/auth/users').then(res => setData(res.data)).catch(() => {});
  }, []);
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 600 }}>Users</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{data.length} user terdaftar</p>
      </div>
      {data.length === 0 ? <Empty label="user" /> : (
        <Table headers={['NIM', 'Nama', 'Terdaftar']}>
          {data.map(item => (
            <TR key={item.nim}>
              <TD><Badge color="#6366f1">{item.nim}</Badge></TD>
              <TD style={{ fontWeight: 500, color: '#f1f5f9' }}>{item.name}</TD>
              <TD>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TD>
            </TR>
          ))}
        </Table>
      )}
    </>
  );
};

const BiodataPanel = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 600 }}>Biodata Mahasiswa</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Informasi pembuat website</p>
      </div>
      <div style={{ maxWidth: 480 }}>
        <div style={{
          background: '#0f172a', border: '1px solid #3b82f644',
          borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 24
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: '#3b82f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 16px', fontWeight: 700, color: '#fff'
          }}>
            {user?.name?.charAt(0) || '?'}
          </div>
          <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: 22, fontWeight: 700 }}>{user?.name}</h3>
          <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: 14 }}>Mahasiswa D-4 Teknik Informatika</p>
        </div>
        <div style={{ background: '#0f172a', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
          {[
            { label: 'NIM', value: user?.nim, icon: '🪪' },
            { label: 'Nama Lengkap', value: user?.name, icon: '👤' },
            { label: 'Program Studi', value: 'D-4 Teknik Informatika', icon: '🎓' },
            { label: 'Fakultas', value: 'Sekolah Vokasi', icon: '🏫' },
            { label: 'Universitas', value: 'Universitas Harkat Negeri', icon: '🏛️' },
            { label: 'Mata Kuliah', value: 'Pemrograman Web 2', icon: '💻' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '14px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid #1e293b' : 'none'
            }}>
              <span style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                <div style={{ fontSize: 15, color: '#f1f5f9', fontWeight: 500, marginTop: 2 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: '#1e293b', borderRadius: 12, padding: '18px 20px',
    border: `1px solid ${color}33`, flex: 1, minWidth: 0
  }}>
    <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
  </div>
);

const Dashboard = () => {
  const [active, setActive] = useState('events');
  const [stats, setStats] = useState({ events: 0, categories: 0, speakers: 0, users: 0 });
  const { user, logout } = useAuthStore();

  useEffect(() => {
    Promise.all([
      axios.get('/events'), axios.get('/categories'),
      axios.get('/speakers'), axios.get('/auth/users')
    ]).then(([ev, cat, spk, usr]) => {
      setStats({ events: ev.data.length, categories: cat.data.length, speakers: spk.data.length, users: usr.data.length });
    }).catch(() => {});
  }, [active]);

  const handleLogout = () => { logout(); window.location.href = '/'; };

  const panels = {
    events: <EventsPanel />,
    categories: <CategoriesPanel />,
    speakers: <SpeakersPanel />,
    users: <UsersPanel />,
    biodata: <BiodataPanel />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: 220, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #334155' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>🎓 EventHub</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {MENUS.map(m => (
            <button key={m.key} onClick={() => setActive(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active === m.key ? '#3b82f620' : 'transparent',
              color: active === m.key ? '#3b82f6' : '#94a3b8',
              fontSize: 14, fontWeight: active === m.key ? 600 : 400,
              marginBottom: 2, textAlign: 'left'
            }}>
              <span>{m.icon}</span><span>{m.label}</span>
              {active === m.key && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #334155' }}>
          <div style={{ padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{user?.nim}</div>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '9px 12px', borderRadius: 8, border: '1px solid #ef444433',
            background: '#ef444411', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 500
          }}>🚪 Logout</button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e293b' }}>
          <h1 style={{ margin: 0, fontSize: 22, color: '#f1f5f9', fontWeight: 700 }}>Halo, {user?.name}! 👋</h1>
          <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: 13 }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {active !== 'biodata' && (
          <div style={{ padding: '20px 28px 0', display: 'flex', gap: 14 }}>
            <StatCard label="Total Events" value={stats.events} color="#3b82f6" icon="📅" />
            <StatCard label="Categories" value={stats.categories} color="#10b981" icon="🗂️" />
            <StatCard label="Speakers" value={stats.speakers} color="#f59e0b" icon="🎤" />
            <StatCard label="Users" value={stats.users} color="#8b5cf6" icon="👤" />
          </div>
        )}
        <div style={{ padding: 28, flex: 1 }}>
          <div style={{ background: '#1e293b', borderRadius: 14, padding: 24, border: '1px solid #334155' }}>
            {panels[active]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;