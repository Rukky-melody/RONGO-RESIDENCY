/**
 * RONGO ART FOUNDATION — Admin CMS JavaScript
 * Handles: Auth verification, Tab navigation, About CRUD,
 *          Team CRUD with image upload, Announcement CRUD,
 *          Subscriber list & CSV export, Toast notifications.
 */

/* ════════════════════════════════════════════════════════════
   1. CONFIG & AUTH UTILITIES
════════════════════════════════════════════════════════════ */

const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? '' 
    : 'https://rongo-residency.onrender.com'; // Direct to Render backend in production, relative locally

function getToken()  { return localStorage.getItem('admin_token'); }
function getAdmin()  { try { return JSON.parse(localStorage.getItem('admin_info')); } catch { return null; } }

function clearAuth() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    window.location.href = '/admin/login.html';
}

/**
 * Authenticated fetch wrapper.
 * Automatically attaches Bearer token. Redirects to login on 401.
 */
async function apiFetch(url, options = {}) {
    const token = getToken();
    if (!token) { clearAuth(); return null; }

    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(API + url, options);

    if (res.status === 401) {
        toast('Session expired. Please log in again.', 'error');
        setTimeout(clearAuth, 1200);
        return null;
    }
    return res;
}

/* ════════════════════════════════════════════════════════════
   2. INITIALISATION
════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
    // Verify token on load
    const res = await apiFetch('/api/admin/verify');
    if (!res || !res.ok) { clearAuth(); return; }

    // Populate admin email display
    const admin = getAdmin();
    if (admin) document.getElementById('admin-email-display').textContent = admin.email;

    // Setup UI
    setupTabs();
    setupModals();
    setupMobileMenu();
    setupLogout();

    // Load initial tab
    loadAbout();
});

/* ════════════════════════════════════════════════════════════
   3. TAB NAVIGATION
════════════════════════════════════════════════════════════ */

const TAB_TITLES = {
    about:         'About Section',
    team:          'Our Team',
    announcements: 'Announcements',
    subscribers:   'Subscribers',
    settings:      'Account Settings'
};

function setupTabs() {
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Update sidebar active state
    document.querySelectorAll('.nav-item[data-tab]').forEach(i => {
        i.classList.toggle('active', i.dataset.tab === tab);
    });

    // Show/hide panels
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    // Update topbar title
    document.getElementById('topbar-title').textContent = TAB_TITLES[tab] || tab;

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('active');

    // Load tab data
    if (tab === 'about')         loadAbout();
    if (tab === 'team')          loadTeam();
    if (tab === 'announcements') loadAnnouncements();
    if (tab === 'subscribers')   loadSubscribers();
    if (tab === 'settings')      loadSettings();
}

/* ════════════════════════════════════════════════════════════
   4. MODAL UTILITIES
════════════════════════════════════════════════════════════ */

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function setupModals() {
    // Close buttons — [data-close="overlay-id"]
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.close));
    });

    // Click outside modal to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    });

    // Team modal
    document.getElementById('add-member-btn').addEventListener('click', () => openAddMemberModal());
    document.getElementById('save-member-btn').addEventListener('click', saveTeamMember);

    // Announcement modal
    document.getElementById('add-announcement-btn').addEventListener('click', () => openAddAnnouncementModal());
    document.getElementById('save-announcement-btn').addEventListener('click', saveAnnouncement);

    // Colour picker sync
    const colorPicker = document.getElementById('ann-color-picker');
    const colorHex    = document.getElementById('ann-color-hex');
    colorPicker.addEventListener('input', () => { colorHex.value = colorPicker.value; });
    colorHex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(colorHex.value)) colorPicker.value = colorHex.value;
    });

    // Image preview
    document.getElementById('member-image').addEventListener('change', e => {
        const file = e.target.files[0];
        const wrap = document.getElementById('member-img-preview');
        if (file) {
            const url = URL.createObjectURL(file);
            wrap.innerHTML = `<img src="${url}" alt="Preview">`;
        }
    });

    // About: add paragraph button
    document.getElementById('add-para-btn').addEventListener('click', () => addParagraphRow(''));

    // About: save button
    document.getElementById('save-about-btn').addEventListener('click', saveAbout);

    // Subscribers export
    document.getElementById('export-csv-btn').addEventListener('click', exportCSV);
}

/* ════════════════════════════════════════════════════════════
   5. TOAST NOTIFICATIONS
════════════════════════════════════════════════════════════ */

function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;

    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

/* ════════════════════════════════════════════════════════════
   6. MOBILE MENU
════════════════════════════════════════════════════════════ */

function setupMobileMenu() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const menuBtn  = document.getElementById('mobile-menu-btn');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    });
}

/* ════════════════════════════════════════════════════════════
   7. LOGOUT
════════════════════════════════════════════════════════════ */

function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        clearAuth();
    });
}

/* ════════════════════════════════════════════════════════════
   8. ABOUT SECTION
════════════════════════════════════════════════════════════ */

async function loadAbout() {
    try {
        const res  = await apiFetch('/api/about');
        const data = await res.json();

        document.getElementById('about-lead').value = data.leadText || '';

        // Clear and re-render paragraph rows
        document.getElementById('paragraph-list').innerHTML = '';
        (data.bodyParagraphs || []).forEach(p => addParagraphRow(p));

    } catch (err) {
        toast('Failed to load about content.', 'error');
    }
}

function addParagraphRow(text = '') {
    const list = document.getElementById('paragraph-list');
    const row  = document.createElement('div');
    row.className = 'paragraph-row';
    row.innerHTML = `
        <textarea placeholder="Paragraph text...">${text}</textarea>
        <button type="button" class="para-remove-btn" title="Remove paragraph">
            <i class="fa-solid fa-trash"></i>
        </button>`;
    row.querySelector('.para-remove-btn').addEventListener('click', () => row.remove());
    list.appendChild(row);
}

async function saveAbout() {
    const btn      = document.getElementById('save-about-btn');
    const feedback = document.getElementById('about-save-feedback');
    const leadText = document.getElementById('about-lead').value.trim();

    if (!leadText) { toast('Lead paragraph cannot be empty.', 'error'); return; }

    const bodyParagraphs = Array.from(
        document.querySelectorAll('#paragraph-list textarea')
    ).map(t => t.value.trim()).filter(Boolean);

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const res = await apiFetch('/api/admin/about', {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ leadText, bodyParagraphs })
        });

        if (res && res.ok) {
            toast('About section saved!', 'success');
            feedback.style.display = 'flex';
            setTimeout(() => { feedback.style.display = 'none'; }, 3000);
        } else {
            const err = await res.json();
            toast(err.error || 'Save failed.', 'error');
        }
    } catch {
        toast('Connection error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
    }
}

/* ════════════════════════════════════════════════════════════
   9. TEAM MEMBERS
════════════════════════════════════════════════════════════ */

async function loadTeam() {
    const tbody = document.getElementById('team-tbody');
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="skeleton" style="height:16px;width:200px;margin:0 auto;"></div></div></td></tr>`;

    try {
        const res     = await apiFetch('/api/team');
        const members = await res.json();

        if (!members.length) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fa-solid fa-users"></i><p>No team members yet. Add your first member!</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = members.map(m => `
            <tr>
                <td>
                    ${m.profileImage
                        ? `<img class="team-avatar-sm" src="${m.profileImage}" alt="${m.name}">`
                        : `<div class="team-avatar-placeholder"><i class="fa-solid fa-user"></i></div>`}
                </td>
                <td><strong>${escHtml(m.name)}</strong></td>
                <td>${escHtml(m.role)}</td>
                <td>${m.order}</td>
                <td>
                    <div class="td-actions">
                        <button class="btn btn-sm btn-secondary" onclick="openEditMemberModal('${m._id}', '${escHtml(m.name)}', '${escHtml(m.role)}', ${m.order}, '${m.profileImage || ''}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmDeleteTeam('${m._id}', '${escHtml(m.name)}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`).join('');

    } catch {
        toast('Failed to load team members.', 'error');
    }
}

function openAddMemberModal() {
    document.getElementById('team-modal-title').textContent = 'Add Team Member';
    document.getElementById('team-member-id').value = '';
    document.getElementById('member-name').value    = '';
    document.getElementById('member-role').value    = '';
    document.getElementById('member-order').value   = '0';
    document.getElementById('member-image').value   = '';
    document.getElementById('member-img-preview').innerHTML = '<i class="fa-solid fa-user"></i>';
    openModal('team-modal-overlay');
}

function openEditMemberModal(id, name, role, order, imgUrl) {
    document.getElementById('team-modal-title').textContent = 'Edit Team Member';
    document.getElementById('team-member-id').value = id;
    document.getElementById('member-name').value    = name;
    document.getElementById('member-role').value    = role;
    document.getElementById('member-order').value   = order;
    document.getElementById('member-image').value   = '';

    const preview = document.getElementById('member-img-preview');
    preview.innerHTML = imgUrl
        ? `<img src="${imgUrl}" alt="${name}">`
        : `<i class="fa-solid fa-user"></i>`;

    openModal('team-modal-overlay');
}

async function saveTeamMember() {
    const btn  = document.getElementById('save-member-btn');
    const id   = document.getElementById('team-member-id').value;
    const name = document.getElementById('member-name').value.trim();
    const role = document.getElementById('member-role').value.trim();
    const order = document.getElementById('member-order').value;
    const file  = document.getElementById('member-image').files[0];

    if (!name || !role) { toast('Name and role are required.', 'error'); return; }

    const formData = new FormData();
    formData.append('name',  name);
    formData.append('role',  role);
    formData.append('order', order);
    if (file) formData.append('profileImage', file);

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const url    = id ? `/api/admin/team/${id}` : '/api/admin/team';
        const method = id ? 'PUT' : 'POST';

        // Note: Don't set Content-Type — let browser set multipart boundary
        const token = getToken();
        const res   = await fetch(API + url, {
            method,
            headers: { 'Authorization': `Bearer ${token}` },
            body:    formData
        });

        if (res.status === 401) { clearAuth(); return; }

        if (res.ok) {
            toast(id ? 'Member updated!' : 'Member added!', 'success');
            closeModal('team-modal-overlay');
            loadTeam();
        } else {
            const err = await res.json();
            toast(err.error || 'Save failed.', 'error');
        }
    } catch {
        toast('Connection error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Member';
    }
}

function confirmDeleteTeam(id, name) {
    document.getElementById('confirm-modal-message').textContent =
        `Delete team member "${name}"? This cannot be undone.`;
    document.getElementById('confirm-delete-btn').onclick = () => deleteTeamMember(id);
    openModal('confirm-modal-overlay');
}

async function deleteTeamMember(id) {
    closeModal('confirm-modal-overlay');
    try {
        const res = await apiFetch(`/api/admin/team/${id}`, { method: 'DELETE' });
        if (res && res.ok) {
            toast('Team member deleted.', 'success');
            loadTeam();
        } else {
            toast('Delete failed.', 'error');
        }
    } catch {
        toast('Connection error.', 'error');
    }
}

/* ════════════════════════════════════════════════════════════
   10. ANNOUNCEMENTS
════════════════════════════════════════════════════════════ */

async function loadAnnouncements() {
    const tbody = document.getElementById('announcements-tbody');
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="skeleton" style="height:16px;width:200px;margin:0 auto;"></div></div></td></tr>`;

    try {
        const res  = await apiFetch('/api/admin/announcements');
        const list = await res.json();

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa-solid fa-bullhorn"></i><p>No announcements yet.</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(a => `
            <tr>
                <td><strong>${escHtml(a.title)}</strong></td>
                <td style="max-width:220px;"><span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(a.message)}</span></td>
                <td>${a.ctaLabel ? `<span style="font-size:0.8rem;">${escHtml(a.ctaLabel)}</span>` : '<span style="color:var(--muted);font-size:0.8rem;">—</span>'}</td>
                <td>
                    <span class="badge ${a.isActive ? 'badge-active' : 'badge-inactive'}">
                        <i class="fa-solid fa-circle" style="font-size:0.45rem;"></i>
                        ${a.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td style="white-space:nowrap; font-size:0.8rem; color:var(--muted);">${new Date(a.createdAt).toLocaleDateString('en-GB')}</td>
                <td>
                    <div class="td-actions">
                        <button class="btn btn-sm btn-secondary" onclick="openEditAnnouncementModal(${JSON.stringify(a).replace(/"/g, '&quot;')})">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="confirmDeleteAnnouncement('${a._id}', '${escHtml(a.title)}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`).join('');

    } catch {
        toast('Failed to load announcements.', 'error');
    }
}

function openAddAnnouncementModal() {
    document.getElementById('announcement-modal-title').textContent = 'New Announcement';
    document.getElementById('announcement-id').value  = '';
    document.getElementById('ann-title').value        = '';
    document.getElementById('ann-message').value      = '';
    document.getElementById('ann-cta-label').value    = '';
    document.getElementById('ann-cta-url').value      = '';
    document.getElementById('ann-color-picker').value = '#3B5254';
    document.getElementById('ann-color-hex').value    = '#3B5254';
    document.getElementById('ann-active').checked     = true;
    openModal('announcement-modal-overlay');
}

function openEditAnnouncementModal(a) {
    document.getElementById('announcement-modal-title').textContent = 'Edit Announcement';
    document.getElementById('announcement-id').value  = a._id;
    document.getElementById('ann-title').value        = a.title       || '';
    document.getElementById('ann-message').value      = a.message     || '';
    document.getElementById('ann-cta-label').value    = a.ctaLabel    || '';
    document.getElementById('ann-cta-url').value      = a.ctaUrl      || '';
    document.getElementById('ann-color-picker').value = a.backgroundColor || '#3B5254';
    document.getElementById('ann-color-hex').value    = a.backgroundColor || '#3B5254';
    document.getElementById('ann-active').checked     = a.isActive;
    openModal('announcement-modal-overlay');
}

async function saveAnnouncement() {
    const btn = document.getElementById('save-announcement-btn');
    const id  = document.getElementById('announcement-id').value;

    const payload = {
        title:           document.getElementById('ann-title').value.trim(),
        message:         document.getElementById('ann-message').value.trim(),
        ctaLabel:        document.getElementById('ann-cta-label').value.trim(),
        ctaUrl:          document.getElementById('ann-cta-url').value.trim(),
        isActive:        document.getElementById('ann-active').checked,
        backgroundColor: document.getElementById('ann-color-hex').value || '#3B5254'
    };

    if (!payload.title || !payload.message) {
        toast('Title and message are required.', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        const url    = id ? `/api/admin/announcements/${id}` : '/api/admin/announcements';
        const method = id ? 'PUT' : 'POST';

        const res = await apiFetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (res && res.ok) {
            toast(id ? 'Announcement updated!' : 'Announcement created!', 'success');
            closeModal('announcement-modal-overlay');
            loadAnnouncements();
        } else {
            const err = await res.json();
            toast(err.error || 'Save failed.', 'error');
        }
    } catch {
        toast('Connection error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';
    }
}

function confirmDeleteAnnouncement(id, title) {
    document.getElementById('confirm-modal-message').textContent =
        `Delete announcement "${title}"? This cannot be undone.`;
    document.getElementById('confirm-delete-btn').onclick = () => deleteAnnouncement(id);
    openModal('confirm-modal-overlay');
}

async function deleteAnnouncement(id) {
    closeModal('confirm-modal-overlay');
    try {
        const res = await apiFetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
        if (res && res.ok) {
            toast('Announcement deleted.', 'success');
            loadAnnouncements();
        } else {
            toast('Delete failed.', 'error');
        }
    } catch {
        toast('Connection error.', 'error');
    }
}

/* ════════════════════════════════════════════════════════════
   11. SUBSCRIBERS
════════════════════════════════════════════════════════════ */

async function loadSubscribers() {
    const tbody = document.getElementById('subscribers-tbody');
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="skeleton" style="height:16px;width:200px;margin:0 auto;"></div></div></td></tr>`;

    try {
        const res  = await apiFetch('/api/admin/subscribers');
        const list = await res.json();

        document.getElementById('sub-total').textContent = list.length;

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="fa-solid fa-envelope"></i><p>No subscribers yet.</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = list.map((s, i) => `
            <tr>
                <td style="color:var(--muted); font-size:0.8rem;">${i + 1}</td>
                <td>${escHtml(s.fullname)}</td>
                <td style="font-family:monospace; font-size:0.84rem;">${escHtml(s.email)}</td>
                <td style="white-space:nowrap; font-size:0.82rem; color:var(--muted);">${s.signupDate ? new Date(s.signupDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A'}</td>
            </tr>`).join('');

    } catch {
        toast('Failed to load subscribers.', 'error');
    }
}

async function exportCSV() {
    const btn = document.getElementById('export-csv-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';
    try {
        const token = getToken();
        const res   = await fetch('/api/admin/subscribers/export', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) { toast('Export failed.', 'error'); return; }

        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'rongo_subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast('CSV exported!', 'success');
    } catch {
        toast('Export error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-download"></i> Export CSV';
    }
}

/* ════════════════════════════════════════════════════════════
   12. SETTINGS
════════════════════════════════════════════════════════════ */

function loadSettings() {
    const admin = getAdmin();
    if (admin) {
        document.getElementById('settings-email').value = admin.email || '';
    }
    document.getElementById('settings-new-password').value = '';
    document.getElementById('settings-current-password').value = '';
}

if (document.getElementById('settings-form')) {
    // Password toggles
    const setupToggle = (toggleId, inputId) => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('click', function() {
                const pwd = document.getElementById(inputId);
                if (pwd.type === 'password') {
                    pwd.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    pwd.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            });
        }
    };
    
    setupToggle('toggle-new-password', 'settings-new-password');
    setupToggle('toggle-current-password', 'settings-current-password');

    document.getElementById('settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('save-settings-btn');
        const currentPassword = document.getElementById('settings-current-password').value;
        const newEmail = document.getElementById('settings-email').value.trim();
        const newPassword = document.getElementById('settings-new-password').value;
        
        if (!currentPassword) {
            toast('Current password is required.', 'error');
            return;
        }
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        
        try {
            const res = await apiFetch('/api/admin/credentials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newEmail, newPassword })
            });
            
            if (res && res.ok) {
                const data = await res.json();
                toast('Settings updated successfully!', 'success');
                
                // Update local storage with new token and admin info
                if (data.token) localStorage.setItem('admin_token', data.token);
                if (data.admin) {
                    localStorage.setItem('admin_info', JSON.stringify(data.admin));
                    document.getElementById('admin-email-display').textContent = data.admin.email;
                }
                
                // Clear passwords
                document.getElementById('settings-current-password').value = '';
                document.getElementById('settings-new-password').value = '';
            } else {
                const err = await res.json();
                toast(err.error || 'Failed to update settings.', 'error');
            }
        } catch {
            toast('Connection error.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Settings';
        }
    });
}

/* ════════════════════════════════════════════════════════════
   13. UTILITIES
════════════════════════════════════════════════════════════ */

/** Escapes HTML special chars to prevent XSS in table renders */
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
