import { createClient } from '@supabase/supabase-js';
import { Project, Order, ProjectStatus, OrderStatus } from '../types';

// Detect if Supabase is configured
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const isRealSupabase = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseUrl.includes('YOUR_') &&
  supabaseAnonKey.length > 20;

export const supabase = isRealSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

const SEED_PROJECTS: Project[] = [];
const SEED_ORDERS: Order[] = [];
const LEGACY_DUMMY_PROJECT_NAMES = new Set([
  'Modern Landing Page - Nusantara Property',
  'Company Profile & Akademik Portal',
  'E-Commerce Toko Online Aura'
]);
const LEGACY_DUMMY_CLIENT_NAMES = new Set([
  'CV Nusantara Sentosa',
  'Yayasan Bina Mulia',
  'Hijab Aura Boutique'
]);
const LEGACY_DUMMY_ORDER_NAMES = new Set([
  'Ahmad Faisal',
  'Siti Rahmawati'
]);

// LocalStorage helpers to simulate database operations when Supabase is config-free
function getLocalProjects(): Project[] {
  const local = localStorage.getItem('simpluse_projects');
  if (!local) {
    localStorage.setItem('simpluse_projects', JSON.stringify(SEED_PROJECTS));
    return SEED_PROJECTS;
  }

  const projects = JSON.parse(local) as Project[];
  const realProjects = projects.filter(project => !isLegacyDummyProject(project));
  if (realProjects.length !== projects.length) {
    setLocalProjects(realProjects);
  }
  return realProjects;
}

function setLocalProjects(projects: Project[]) {
  try {
    localStorage.setItem('simpluse_projects', JSON.stringify(projects));
  } catch (error: any) {
    const isQuotaError =
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22 ||
      error?.code === 1014;

    if (isQuotaError) {
      throw new Error('Penyimpanan browser penuh. Gunakan URL gambar Cloudinary/hosting untuk screenshot, jangan upload file gambar besar langsung.');
    }

    throw error;
  }
}

function getLocalOrders(): Order[] {
  const local = localStorage.getItem('simpluse_orders');
  if (!local) {
    localStorage.setItem('simpluse_orders', JSON.stringify(SEED_ORDERS));
    return SEED_ORDERS;
  }

  const orders = JSON.parse(local) as Order[];
  const realOrders = orders.filter(order => !isLegacyDummyOrder(order));
  if (realOrders.length !== orders.length) {
    setLocalOrders(realOrders);
  }
  return realOrders;
}

function setLocalOrders(orders: Order[]) {
  localStorage.setItem('simpluse_orders', JSON.stringify(orders));
}

function isSeedId(id?: string) {
  return !!id && id.startsWith('seed-');
}

function isLegacyDummyProject(project: Project) {
  return (
    isSeedId(project.id) ||
    LEGACY_DUMMY_PROJECT_NAMES.has(project.project_name) ||
    LEGACY_DUMMY_CLIENT_NAMES.has(project.client_name)
  );
}

function isLegacyDummyOrder(order: Order) {
  return isSeedId(order.id) || LEGACY_DUMMY_ORDER_NAMES.has(order.full_name);
}

function createLocalProject(project: Partial<Project>): Project {
  return {
    id: project.id && !isSeedId(project.id)
      ? project.id
      : 'local-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    created_at: new Date().toISOString(),
    client_name: project.client_name || '',
    client_wa: project.client_wa || '',
    client_email: project.client_email || '',
    project_name: project.project_name || 'Project Baru',
    internal_notes: project.internal_notes || '',
    status: project.status || 'ongoing',
    start_date: project.start_date || new Date().toISOString().substring(0, 10),
    deadline: project.deadline || new Date().toISOString().substring(0, 10),
    total_price: Number(project.total_price) || 0,
    dp_paid: Number(project.dp_paid) || 0,
    tech_stack: project.tech_stack || [],
    is_public: project.is_public ?? false,
    public_name: project.public_name || '',
    screenshot_url: project.screenshot_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    live_url: project.live_url || '',
    description: project.description || ''
  };
}

function saveProjectLocally(project: Partial<Project>): Project {
  const projects = getLocalProjects();
  if (project.id) {
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      const updated = { ...projects[index], ...project } as Project;
      projects[index] = updated;
      setLocalProjects(projects);
      return updated;
    }
  }

  const newProject = createLocalProject(project);
  projects.unshift(newProject);
  setLocalProjects(projects);
  return newProject;
}

function toSupabaseProjectPayload(project: Partial<Project>, includeId = false) {
  const payload: Partial<Project> = {
    client_name: project.client_name,
    client_wa: project.client_wa,
    client_email: project.client_email,
    project_name: project.project_name,
    internal_notes: project.internal_notes,
    status: project.status,
    start_date: project.start_date,
    deadline: project.deadline,
    total_price: Number(project.total_price) || 0,
    dp_paid: Number(project.dp_paid) || 0,
    tech_stack: project.tech_stack || [],
    is_public: project.is_public ?? false,
    public_name: project.public_name,
    screenshot_url: project.screenshot_url,
    live_url: project.live_url,
    description: project.description
  };

  if (includeId && project.id && !isSeedId(project.id)) {
    payload.id = project.id;
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

function mergeProjects(remoteProjects: Project[], localProjects: Project[]) {
  const merged = new Map<string, Project>();
  remoteProjects
    .filter(project => !isLegacyDummyProject(project))
    .forEach(project => merged.set(project.id, project));
  localProjects
    .filter(project => !isLegacyDummyProject(project))
    .forEach(project => merged.set(project.id, project));

  return Array.from(merged.values()).sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
}

export const db = {
  // Check client state
  isSupabaseConfigured(): boolean {
    return isRealSupabase;
  },

  // Projects API
  async getProjects(): Promise<Project[]> {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        return mergeProjects(data as Project[], getLocalProjects());
      }
      console.warn('Real Supabase fetch error or table missing, falling back to local storage:', error);
    }
    return getLocalProjects();
  },

  async getProjectById(id: string): Promise<Project | null> {
    const localProject = getLocalProjects().find(p => p.id === id);
    if (localProject) return localProject;

    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        return data as Project;
      }
    }
    return null;
  },

  async saveProject(project: Partial<Project>): Promise<Project> {
    if (isRealSupabase && supabase) {
      try {
        if (project.id && !isSeedId(project.id)) {
          const { data, error } = await supabase
            .from('projects')
            .update(toSupabaseProjectPayload(project))
            .eq('id', project.id)
            .select()
            .single();
          if (error) throw error;
          if (data) return data as Project;
        } else {
          const { data, error } = await supabase
            .from('projects')
            .insert([toSupabaseProjectPayload(project)])
            .select()
            .single();
          if (error) throw error;
          if (data) return data as Project;
        }
      } catch (error) {
        console.warn('Supabase project save failed. Saving to local browser storage instead:', error);
      }
    }

    return saveProjectLocally(project);
  },

  async deleteProject(id: string): Promise<boolean> {
    const deleteLocalProject = () => {
      const projects = getLocalProjects();
      const filtered = projects.filter(p => p.id !== id);
      setLocalProjects(filtered);
    };

    if (isRealSupabase && supabase) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.warn('Supabase project delete failed. Removing local project copy only:', error);
      }
    }

    deleteLocalProject();
    return true;
  },

  // Orders API
  async getOrders(): Promise<Order[]> {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        return (data as Order[]).filter(order => !isLegacyDummyOrder(order));
      }
    }
    return getLocalOrders();
  },

  async saveOrder(order: Partial<Order>): Promise<Order> {
    // Send public order client-side triggers a submit endpoint to send email + save.
    // Call the backup local handler as normal:
    const orders = getLocalOrders();
    const newOrder: Order = {
      id: order.id || 'order-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      created_at: order.created_at || new Date().toISOString(),
      full_name: order.full_name || '',
      whatsapp: order.whatsapp || '',
      email: order.email || '',
      website_type: order.website_type || '',
      description: order.description || '',
      budget: order.budget || '',
      deadline: order.deadline || '',
      status: order.status || 'new'
    };
    orders.unshift(newOrder);
    setLocalOrders(orders);

    // Call server endpoint to save order via Supabase (if configured server-side) and trigger Resend email
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (response.ok) {
        const saved = await response.json();
        // If server returns real DB record, update our ID
        if (saved && saved.id) {
          const idx = orders.findIndex(o => o.id === newOrder.id);
          if (idx !== -1) {
            orders[idx] = saved;
            setLocalOrders(orders);
            return saved;
          }
        }
      }
    } catch (e) {
      console.warn('Network API Call to server /api/orders skipped or failed, using local storage backup:', e);
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    if (isRealSupabase && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Order;
    }
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      setLocalOrders(orders);
      return orders[index];
    }
    return null;
  },

  async deleteOrder(id: string): Promise<boolean> {
    if (isRealSupabase && supabase) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (!error) return true;
    }
    const orders = getLocalOrders();
    const filtered = orders.filter(o => o.id !== id);
    setLocalOrders(filtered);
    return true;
  },

  // Auth Simulation & Integration
  async login(email: string, pass: string): Promise<{ success: boolean; user?: any; error?: string }> {
    // Local authentication fallback for convenience (always works first, bypassing Supabase Auth for immediate accessibility)
    if ((email === 'admin@simpluse.id' || email === 'diyaznajib.93@gmail.com') && pass === 'admin123') {
      const mockUser = { email, id: 'mock-owner-uid-123', name: 'Simpluse Admin' };
      localStorage.setItem('simpluse_session', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } else if (email === 'admin' && pass === 'admin') {
      const mockUser = { email: 'admin@simpluse.id', id: 'mock-owner-uid-123', name: 'Simpluse Admin' };
      localStorage.setItem('simpluse_session', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    }

    if (isRealSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (!error && data?.user) {
        const sessionUser = { 
          email: data.user.email, 
          id: data.user.id, 
          name: data.user.email?.split('@')[0] || 'User' 
        };
        localStorage.setItem('simpluse_session', JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
      }
      return { success: false, error: error?.message || 'Login Gagal' };
    }
    
    return { success: false, error: 'Email atau password salah. Coba sbg admin/admin atau diyaznajib.93@gmail.com / admin123' };
  },

  logout() {
    if (isRealSupabase && supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem('simpluse_session');
  },

  getCurrentUser() {
    if (isRealSupabase && supabase) {
      // Return local cached user session or check supabase
      const local = localStorage.getItem('simpluse_session');
      if (local) return JSON.parse(local);
      
      // Wait, we can get session asynchronously but having synchronous access is super helpful for router guards
    }
    const local = localStorage.getItem('simpluse_session');
    if (local) return JSON.parse(local);
    return null;
  }
};
