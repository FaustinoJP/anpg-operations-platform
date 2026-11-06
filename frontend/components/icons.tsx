export type IconName =
  | 'dashboard' | 'bars' | 'pie' | 'database' | 'users' | 'upload' | 'file'
  | 'shield' | 'settings' | 'bell' | 'help' | 'refresh' | 'calendar'
  | 'filter' | 'well' | 'rig' | 'money' | 'trend' | 'clock' | 'warning'
  | 'box' | 'download' | 'arrowUp' | 'globe' | 'crown' | 'contract'
  | 'warehouse' | 'check' | 'lock' | 'search' | 'edit';

export function Icon({ name }: { name: IconName }) {
  switch (name) {
    case 'dashboard':
      return <svg viewBox="0 0 24 24"><path d="M4 13a8 8 0 1 1 16 0"/><path d="M12 13l4-5"/><path d="M4 13h16"/><path d="M7 17h10"/></svg>;
    case 'bars':
      return <svg viewBox="0 0 24 24"><path d="M4 20V9"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/><path d="M7 20V13"/><path d="M13 20V8"/><path d="M19 20v-4"/></svg>;
    case 'pie':
      return <svg viewBox="0 0 24 24"><path d="M12 3v9h9"/><path d="M21 12A9 9 0 1 1 12 3"/><path d="M14 3.3A9 9 0 0 1 20.7 10H14z"/></svg>;
    case 'database':
      return <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>;
    case 'users':
      return <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'upload':
      return <svg viewBox="0 0 24 24"><path d="M12 3v13"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/><path d="M5 17v4"/><path d="M19 17v4"/></svg>;
    case 'file':
      return <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>;
    case 'shield':
      return <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'settings':
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/></svg>;
    case 'bell':
      return <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
    case 'help':
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.4-2.9 1.6-2.9 3"/><path d="M12 17h.01"/></svg>;
    case 'refresh':
      return <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/></svg>;
    case 'calendar':
      return <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>;
    case 'filter':
      return <svg viewBox="0 0 24 24"><path d="M4 4h16l-6 7v6l-4 3v-9z"/></svg>;
    case 'well':
      return <svg viewBox="0 0 24 24"><path d="M12 3l7 18H5z"/><path d="M9 10h6"/><path d="M8 14h8"/><path d="M12 3v18"/></svg>;
    case 'rig':
      return <svg viewBox="0 0 24 24"><path d="M12 3l7 18H5z"/><path d="M12 3v18"/><path d="M8.5 12h7"/><path d="M7 17h10"/><path d="M10 7h4"/></svg>;
    case 'money':
      return <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M7 10v4"/><path d="M17 10v4"/></svg>;
    case 'trend':
      return <svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>;
    case 'clock':
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>;
    case 'warning':
      return <svg viewBox="0 0 24 24"><path d="M10.3 4.4L2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.4a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
    case 'box':
      return <svg viewBox="0 0 24 24"><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3.3 7.5L12 12l8.7-4.5"/><path d="M12 22V12"/></svg>;
    case 'download':
      return <svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>;
    case 'arrowUp':
      return <svg viewBox="0 0 24 24"><path d="M12 21V5"/><path d="M5 12l7-7 7 7"/></svg>;
    case 'globe':
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>;
    case 'crown':
      return <svg viewBox="0 0 24 24"><path d="M3 8l4 3 5-7 5 7 4-3-2 10H5z"/><path d="M5 21h14"/></svg>;
    case 'contract':
      return <svg viewBox="0 0 24 24"><path d="M8 2h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M16 2v5h5"/><path d="M8 12h8"/><path d="M8 16h6"/></svg>;
    case 'warehouse':
      return <svg viewBox="0 0 24 24"><path d="M3 21V8l9-5 9 5v13"/><path d="M7 21V11h10v10"/><path d="M7 15h10"/><path d="M10 21v-6"/><path d="M14 21v-6"/></svg>;
    case 'check':
      return <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>;
    case 'lock':
      return <svg viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case 'search':
      return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'edit':
      return <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>;
    default:
      return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>;
  }
}
