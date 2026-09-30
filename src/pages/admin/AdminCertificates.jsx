import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Award, Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { Navbar } from '../../components/layout/Navbar'

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminCertificates() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: certs, isLoading } = useQuery({
    queryKey: ['admin-all-certs'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return JSON.parse(localStorage.getItem('mock_certificates') ?? '[]')
      }
      const { data } = await supabase
        .from('certificates')
        .select('*, profiles(full_name, site_location)')
        .order('issued_at', { ascending: false })
      return data ?? []
    },
  })

  const filtered = (certs ?? []).filter(c =>
    !search ||
    c.trainee_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.cert_number?.toLowerCase().includes(search.toLowerCase()) ||
    c.course_name?.toLowerCase().includes(search.toLowerCase())
  )

  const validCount = (certs ?? []).filter(c => c.status === 'valid').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--navbar-height) + 24px)', paddingBottom: 48 }}>
        <div className="page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Certificate Registry</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                {validCount} valid · {filtered.length} shown
              </p>
            </div>
            <div style={{ position: 'relative', minWidth: 260 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name, cert ID, course…" style={{ paddingLeft: 38 }} />
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 48 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : !filtered.length ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Award size={40} style={{ color: 'var(--color-border-strong)', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>
                {search ? 'No certificates match your search.' : 'No certificates issued yet.'}
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Certificate ID</th>
                      <th>Trainee</th>
                      <th>Course</th>
                      <th>Score</th>
                      <th>Issued</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(cert => (
                      <tr key={cert.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                          {cert.cert_number}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{cert.trainee_name ?? cert.profiles?.full_name ?? '—'}</div>
                          {cert.profiles?.site_location && (
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              📍 {cert.profiles.site_location}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: 'var(--text-sm)' }}>{cert.course_name}</td>
                        <td style={{ fontWeight: 700 }}>{cert.score}%</td>
                        <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{fmtDate(cert.issued_at)}</td>
                        <td>
                          <span className={`badge ${cert.status === 'valid' ? 'badge-success' : 'badge-danger'}`}>
                            {cert.status === 'valid'
                              ? <><CheckCircle size={10} /> Valid</>
                              : <><XCircle size={10} /> {cert.status}</>
                            }
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => navigate(`/certificate/${cert.id}`)}>
                              View
                            </button>
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => window.open(`/verify/${cert.cert_number}`, '_blank')}>
                              <ExternalLink size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
