import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, EditOutlined, ShoppingCartOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { requestLogout } from '../config/UserRequest';
import { requestGetCart } from '../config/CartRequest';

const logoGreen = "/images/logo-meditea-green.png";

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
  const [scrolled, setScrolled] = useState(window.scrollY > 90);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const fetchCartCount = async () => {
    try {
      const res = await requestGetCart();
      const items = res?.metadata?.cart?.products || [];
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  const loadUserFromStorage = () => {
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
    const handleUserChanged = () => loadUserFromStorage();
    window.addEventListener('userChanged', handleUserChanged);
    return () => window.removeEventListener('userChanged', handleUserChanged);
  }, []);

  useEffect(() => {
    if (user) fetchCartCount();
    else setCartCount(0);
  }, [user]);

  useEffect(() => {
    const handleCartChanged = () => { if (user) fetchCartCount(); };
    window.addEventListener('cartChanged', handleCartChanged);
    return () => window.removeEventListener('cartChanged', handleCartChanged);
  }, [user]);

  useEffect(() => {
    const handleResize = () => setMobileView(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try { await requestLogout(); } catch {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setDropdownOpen(false);
    setCartCount(0);
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  const handleCartClick = () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để mua sắm");
      return;
    }
    navigate('/cart');
  };

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/about', label: 'Về MediTea' },
    { to: '/story-2', label: 'Triết lý' },
    { to: '/bancha-detail', label: 'Kiến thức' },
    { to: '/shop', label: 'Sản phẩm' },
    { to: '/blog', label: 'Bài Viết' },
    { to: '/media', label: 'Thư viện ảnh' },
  ];

  const solidHeaderRoutes = [
    '/cart',
    '/shop',
    '/blog',
    '/checkout',
    '/payment-success',
    '/payment-sepay',
    '/product/',
    '/product-main',
    '/product-list',
    '/3d-products',
    '/faq',
    '/privacy',
    '/terms',
  ];

  const solidHeader =
    scrolled || solidHeaderRoutes.some((path) => location.pathname.startsWith(path));

  if (mobileView) {
    return (
      <>
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
          display: 'flex', alignItems: 'center',
          padding: '10px 14px', background: '#ffffff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <button onClick={() => setSidebarOpen(true)} style={{
              width: 38, height: 38, borderRadius: 999, border: '1px solid rgba(149,113,89,0.35)',
              background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer'
            }}>
              <MenuOutlined style={{ color: '#6b5b4f', fontSize: 18 }} />
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Link to='/'>
              <img src={logoGreen} alt='MediTEA' style={{ height: 90, objectFit: 'contain' }} />
            </Link>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
            {user && (
              <button onClick={() => navigate('/cart')} style={{
                width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #6b5b4f',
                background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative'
              }}>
                <ShoppingCartOutlined style={{ color: '#6b5b4f', fontSize: 16 }} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4, background: '#c25139', color: '#fff',
                    borderRadius: '50%', width: 18, height: 18, fontSize: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                  }}>{cartCount}</span>
                )}
              </button>
            )}
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                  width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #6b5b4f',
                  background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer'
                }}>
                  <UserOutlined style={{ color: '#6b5b4f', fontSize: 16 }} />
                </button>
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 44, right: 0, background: '#fff',
                    borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: 180, zIndex: 9999, overflow: 'hidden'
                  }}>
                    <button onClick={() => { setDropdownOpen(false); navigate('/edit-profile'); }} style={{
                      width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      fontSize: 14, color: '#3d2e1e', borderBottom: '1px solid #f0f0f0'
                    }}>
                      <EditOutlined /> Thay đổi thông tin
                    </button>
                    <button onClick={handleLogout} style={{
                      width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      fontSize: 14, color: '#c25139'
                    }}>
                      <LogoutOutlined /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to='/login' style={{
                padding: '8px 14px', backgroundColor: '#957159', color: '#fff',
                borderRadius: 30, fontWeight: 700, fontSize: 11, textDecoration: 'none',
                fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
                letterSpacing: '0.8px', whiteSpace: 'nowrap'
              }}>Đăng nhập</Link>
            )}
          </div>
        </div>

        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10001
            }} />
            <div style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
              background: '#fff', zIndex: 10002, padding: '20px 0',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <img src={logoGreen} alt='MediTEA' style={{ height: 85, objectFit: 'contain' }} />
                <button onClick={() => setSidebarOpen(false)} style={{
                  width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer',
                  display: 'grid', placeItems: 'center'
                }}>
                  <CloseOutlined style={{ color: '#6b5b4f', fontSize: 18 }} />
                </button>
              </div>
              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
                {navLinks.map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} style={{
                    padding: '14px 20px', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                    color: isActive(item.to) ? '#7ca844' : '#3d2e1e',
                    borderLeft: isActive(item.to) ? '3px solid #7ca844' : '3px solid transparent',
                    background: isActive(item.to) ? 'rgba(124,168,68,0.06)' : 'transparent',
                    transition: 'all 0.2s'
                  }}>{item.label}</Link>
                ))}
              </nav>
              {user?.isAdmin && (
                <Link to="/admin/manage-content" onClick={() => setSidebarOpen(false)} style={{
                  padding: '14px 20px', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                  color: '#7ca844', display: 'flex', alignItems: 'center', gap: 8,
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <EditOutlined /> Quản lý nội dung
                </Link>
              )}

            </div>
          </>
        )}
      </>
    );
  }

  const desktopActionStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: solidHeader ? '1.5px solid rgba(124,168,68,0.45)' : '1.5px solid rgba(255,255,255,0.85)',
    background: solidHeader ? '#fff' : 'rgba(255,255,255,0.92)',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    boxShadow: solidHeader ? '0 6px 18px rgba(0,0,0,0.08)' : '0 10px 28px rgba(0,0,0,0.16)',
    backdropFilter: solidHeader ? 'none' : 'blur(10px)',
  };

  const desktopActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={handleCartClick} style={desktopActionStyle}>
            <ShoppingCartOutlined style={{ color: '#6b5b4f', fontSize: 18 }} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, background: '#c25139', color: '#fff',
                borderRadius: '50%', width: 20, height: 20, fontSize: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>{cartCount}</span>
            )}
          </button>

        {user ? (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={desktopActionStyle}>
              <UserOutlined style={{ color: '#6b5b4f', fontSize: 18 }} />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 48, right: 0, background: '#fff',
                borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: 200, overflow: 'hidden', zIndex: 9999,
                border: '1px solid rgba(149,113,89,0.08)'
              }}>
                <div style={{
                  padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0'
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#3d2e1e' }}>
                    {user.fullName || user.name || user.email || 'User'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b5b4f', marginTop: 2 }}>{user.email || ''}</div>
                </div>
                <button onClick={() => { setDropdownOpen(false); navigate('/edit-profile'); }} style={{
                  width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14, color: '#3d2e1e', transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#faf6f2'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <EditOutlined /> Thay đổi thông tin
                </button>
                <div style={{ height: 1, background: '#f0f0f0' }} />
                <button onClick={handleLogout} style={{
                  width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14, color: '#c25139', transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#fff5f2'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/login' style={{
            padding: '10px 24px',
            backgroundColor: solidHeader ? '#7ca844' : '#ffd895',
            color: solidHeader ? '#ffffff' : '#6b3d2f',
            borderRadius: 30, fontWeight: 700, fontSize: 12, textDecoration: 'none',
            fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
            letterSpacing: '1px', whiteSpace: 'nowrap', transition: 'all 0.2s',
            border: solidHeader ? '2px solid #7ca844' : '2px solid #ffd895',
            boxShadow: solidHeader ? 'none' : '0 10px 30px rgba(0,0,0,0.18)'
          }}>
            Đăng nhập
          </Link>
        )}
      </div>
  );

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        height: solidHeader ? 82 : 84,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: solidHeader ? '0 72px' : '18px 72px',
        background: solidHeader ? '#ffffff' : 'transparent',
        borderBottom: solidHeader ? '1px solid rgba(107,91,79,0.12)' : '1px solid transparent',
        boxShadow: solidHeader ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
        transition: 'background 0.28s ease, box-shadow 0.28s ease, height 0.28s ease, padding 0.28s ease',
        pointerEvents: 'none'
      }}>
        <nav style={{
          display: solidHeader ? 'flex' : 'none',
          gridColumn: 1,
          alignItems: 'center',
          gap: 28,
          justifySelf: 'start',
          pointerEvents: 'auto'
        }}>
          {navLinks.slice(0, 4).map(item => (
            <Link key={item.to} to={item.to} style={{
              color: isActive(item.to) ? '#7ca844' : '#7ca844',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s ease'
            }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link to='/' style={{
          gridColumn: 2,
          justifySelf: 'center',
          opacity: solidHeader ? 1 : 0,
          transform: solidHeader ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.24s ease, transform 0.24s ease',
          pointerEvents: solidHeader ? 'auto' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={logoGreen} alt='MediTEA' style={{ height: 86, objectFit: 'contain' }} />
        </Link>

        <div style={{
          gridColumn: 3,
          display: 'flex',
          alignItems: 'center',
          gap: solidHeader ? 26 : 12,
          justifySelf: 'end',
          pointerEvents: 'auto'
        }}>
          {solidHeader && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {navLinks.slice(4).map(item => (
                <Link key={item.to} to={item.to} style={{
                  color: isActive(item.to) ? '#7ca844' : '#7ca844',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease'
                }}>
                  {item.label}
                </Link>
              ))}
              {user?.isAdmin && (
                <Link to="/admin/manage-content" style={{
                  color: '#7ca844',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}>
                  Quản lý nội dung
                </Link>
              )}
            </nav>
          )}
          {desktopActions}
        </div>
      </header>
    </>
  );
}

export default Header;
