import { useEffect, useState } from 'react';
import { getLeads, updateLeadStatus, deleteLead, type Lead, type LeadStatus } from '../../lib/store';
import { formatPrice } from '../../lib/utils';
import { T } from '../ui';

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Закрыта',
};

const STATUS_COLOR: Record<LeadStatus, { bg: string; fg: string }> = {
  new:         { bg: '#FEF3C7', fg: '#92400E' },
  in_progress: { bg: '#DBEAFE', fg: '#1E40AF' },
  done:        { bg: '#DCFCE7', fg: '#166534' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | LeadStatus>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try { setLeads(await getLeads()); }
    finally { setLoading(false); }
  };

  useEffect(() => { void refresh(); }, []);

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    in_progress: leads.filter(l => l.status === 'in_progress').length,
    done: leads.filter(l => l.status === 'done').length,
  };

  const handleStatus = async (id: string, status: LeadStatus) => {
    await updateLeadStatus(id, status);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    await deleteLead(id);
    await refresh();
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '8px 14px', borderRadius: T.radiusSm, fontSize: 12.5,
    fontWeight: active ? 600 : 500, cursor: 'pointer',
    background: active ? T.brand : 'transparent',
    color: active ? '#fff' : T.ink,
    border: `1px solid ${active ? T.brand : T.border}`,
    fontFamily: T.font, transition: 'all 0.15s',
  });

  return (
    <div style={{ padding: 40, fontFamily: T.font }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: T.ink, marginBottom: 5, letterSpacing: -0.3 }}>Заявки</h1>
        <p style={{ fontSize: 13.5, color: T.muted }}>{counts.all} всего · {counts.new} новых</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        <button style={tabBtn(filter === 'all')}        onClick={() => setFilter('all')}>Все · {counts.all}</button>
        <button style={tabBtn(filter === 'new')}        onClick={() => setFilter('new')}>Новые · {counts.new}</button>
        <button style={tabBtn(filter === 'in_progress')} onClick={() => setFilter('in_progress')}>В работе · {counts.in_progress}</button>
        <button style={tabBtn(filter === 'done')}       onClick={() => setFilter('done')}>Закрытые · {counts.done}</button>
      </div>

      {loading ? (
        <div style={{ color: T.muted, fontSize: 13 }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: T.card, border: `1px dashed ${T.border}`, borderRadius: T.radius,
          padding: '48px 20px', textAlign: 'center', color: T.muted, fontSize: 13.5,
        }}>
          {filter === 'all' ? 'Заявок пока нет.' : 'Нет заявок в этом статусе.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(lead => {
            const isOpen = expanded === lead.id;
            const color = STATUS_COLOR[lead.status];
            return (
              <div key={lead.id} style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius,
                boxShadow: T.shadowSm, overflow: 'hidden',
              }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16,
                  alignItems: 'center', padding: '18px 22px', cursor: 'pointer',
                }} onClick={() => setExpanded(isOpen ? null : lead.id)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>{lead.name}</span>
                      <span style={{ fontSize: 11, color: T.muted }}>·</span>
                      <span style={{ fontSize: 13, color: T.ink }}>{lead.phone}</span>
                      <span style={{
                        background: lead.type === 'checkout' ? '#FEF3C7' : '#E0E7FF',
                        color: lead.type === 'checkout' ? '#92400E' : '#3730A3',
                        fontSize: 10, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
                        textTransform: 'uppercase', letterSpacing: 0.5,
                      }}>
                        {lead.type === 'checkout' ? 'Заказ' : 'Консультация'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: T.muted }}>
                      {formatDate(lead.createdAt)}
                      {lead.productName && ` · ${lead.productName}`}
                      {lead.total !== undefined && ` · ${formatPrice(lead.total)}`}
                    </p>
                  </div>
                  <span style={{
                    background: color.bg, color: color.fg, fontSize: 11, fontWeight: 600,
                    padding: '5px 11px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                  <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                    style={{ color: T.brand, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                    Позвонить →
                  </a>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {isOpen && (
                  <div style={{ borderTop: `1px solid ${T.line}`, padding: '18px 22px', background: T.pageBg }}>
                    {lead.address && (
                      <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 4 }}>Адрес</p>
                        <p style={{ fontSize: 13.5, color: T.ink }}>{lead.address}</p>
                      </div>
                    )}
                    {lead.message && (
                      <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 4 }}>Комментарий</p>
                        <p style={{ fontSize: 13.5, color: T.ink, whiteSpace: 'pre-wrap' }}>{lead.message}</p>
                      </div>
                    )}
                    {lead.cart && lead.cart.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: T.muted, fontWeight: 600, marginBottom: 6 }}>Корзина</p>
                        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: T.radiusSm, padding: '10px 14px' }}>
                          {lead.cart.map((line, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.ink, padding: '4px 0' }}>
                              <span>{line.name} × {line.qty}</span>
                              <span>{formatPrice(line.price * line.qty)}</span>
                            </div>
                          ))}
                          {lead.discount && lead.discount > 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#C0392B', padding: '4px 0', borderTop: `1px solid ${T.line}`, marginTop: 6 }}>
                              <span>Скидка</span>
                              <span>−{formatPrice(lead.discount)}</span>
                            </div>
                          ) : null}
                          {lead.total !== undefined && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: T.ink, padding: '6px 0 0', borderTop: `1px solid ${T.line}`, marginTop: 6 }}>
                              <span>Итого</span>
                              <span>{formatPrice(lead.total)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {(['new', 'in_progress', 'done'] as LeadStatus[]).map(s => (
                        <button key={s}
                          onClick={() => handleStatus(lead.id, s)}
                          disabled={lead.status === s}
                          style={{
                            padding: '7px 13px', borderRadius: T.radiusSm, fontSize: 12, fontWeight: 600,
                            border: `1px solid ${lead.status === s ? T.brand : T.border}`,
                            background: lead.status === s ? T.brand : T.card,
                            color: lead.status === s ? '#fff' : T.ink,
                            cursor: lead.status === s ? 'default' : 'pointer',
                            fontFamily: T.font, opacity: lead.status === s ? 1 : 0.85,
                          }}>
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                      <div style={{ flex: 1 }} />
                      <button onClick={() => handleDelete(lead.id)} style={{
                        padding: '7px 13px', borderRadius: T.radiusSm, fontSize: 12, fontWeight: 500,
                        border: 'none', background: 'transparent', color: T.danger,
                        cursor: 'pointer', fontFamily: T.font,
                      }}>
                        Удалить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
