import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const WasteManagementDSS = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showDetails, setShowDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [criteria, setCriteria] = useState([
    { name: 'Kesesuaian organik', weight: 0.15, ideal: 5, type: 'benefit' },
    { name: 'Kapasitas', weight: 0.12, ideal: 5, type: 'benefit' },
    { name: 'Lahan', weight: 0.08, ideal: 5, type: 'cost' },
    { name: 'Teknologi', weight: 0.10, ideal: 5, type: 'benefit' },
    { name: 'Fleksibilitas', weight: 0.07, ideal: 4, type: 'benefit' },
    { name: 'Reduksi GRK', weight: 0.12, ideal: 5, type: 'benefit' },
    { name: 'Risiko pencemaran', weight: 0.10, ideal: 5, type: 'cost' },
    { name: 'Circular economy', weight: 0.08, ideal: 5, type: 'benefit' },
    { name: 'Regulasi', weight: 0.06, ideal: 5, type: 'benefit' },
    { name: 'CAPEX', weight: 0.08, ideal: 5, type: 'cost' },
    { name: 'OPEX', weight: 0.07, ideal: 5, type: 'cost' },
    { name: 'Pendapatan', weight: 0.06, ideal: 5, type: 'benefit' },
    { name: 'Penerimaan', weight: 0.05, ideal: 5, type: 'benefit' },
    { name: 'Lapangan kerja', weight: 0.04, ideal: 4, type: 'benefit' },
    { name: 'Kebijakan', weight: 0.05, ideal: 5, type: 'benefit' },
    { name: 'SDM', weight: 0.05, ideal: 3, type: 'cost' }
  ]);

  const alternatives = [
    { name: 'Landfill', values: [3, 5, 1, 5, 5, 1, 1, 1, 2, 4, 3, 1, 2, 2, 2, 4] },
    { name: 'Komposting', values: [5, 3, 3, 5, 3, 3, 4, 3, 5, 5, 4, 2, 4, 4, 4, 4] },
    { name: 'AD/Biogas', values: [5, 3, 3, 4, 3, 5, 3, 4, 4, 3, 3, 4, 3, 3, 4, 2] },
    { name: 'WTE', values: [4, 5, 4, 4, 4, 4, 3, 3, 4, 2, 2, 5, 2, 3, 5, 2] },
    { name: 'Gasifikasi', values: [4, 4, 4, 3, 3, 4, 3, 3, 3, 1, 2, 4, 2, 3, 4, 1] },
    { name: 'RDF', values: [3, 4, 4, 4, 4, 3, 4, 3, 4, 3, 3, 4, 3, 3, 4, 3] },
    { name: 'Daur Ulang', values: [1, 2, 3, 5, 2, 3, 5, 5, 5, 4, 4, 4, 5, 4, 4, 3] }
  ];

  const convertGap = (gap) => {
    const conversion = {
      0: 5, 1: 4.5, '-1': 4, 2: 3.5, '-2': 3,
      3: 2.5, '-3': 2, 4: 1.5, '-4': 1
    };
    return conversion[gap] || 1;
  };

  const calculateProfileMatching = () => {
    const results = alternatives.map(alt => {
      let totalScore = 0;
      const details = [];
      
      criteria.forEach((crit, idx) => {
        const gap = alt.values[idx] - crit.ideal;
        const converted = convertGap(gap);
        const weighted = converted * crit.weight;
        totalScore += weighted;
        
        details.push({
          criteria: crit.name,
          value: alt.values[idx],
          ideal: crit.ideal,
          gap: gap,
          converted: converted,
          weight: crit.weight,
          weighted: weighted.toFixed(4)
        });
      });
      
      return {
        name: alt.name,
        score: totalScore.toFixed(2),
        details: details
      };
    });

    return results.sort((a, b) => b.score - a.score);
  };

  const calculateElectre = () => {
    const normalized = [];
    for (let i = 0; i < criteria.length; i++) {
      let sumSquares = 0;
      alternatives.forEach(alt => {
        sumSquares += Math.pow(alt.values[i], 2);
      });
      const sqrtSum = Math.sqrt(sumSquares);
      
      normalized.push(alternatives.map(alt => ({
        name: alt.name,
        original: alt.values[i],
        normalized: (alt.values[i] / sqrtSum).toFixed(4)
      })));
    }

    const weighted = [];
    for (let i = 0; i < criteria.length; i++) {
      weighted.push(normalized[i].map(item => ({
        name: item.name,
        normalized: parseFloat(item.normalized),
        weighted: (parseFloat(item.normalized) * criteria[i].weight).toFixed(4)
      })));
    }

    const n = alternatives.length;
    const concordanceMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    const discordanceMatrix = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let k = 0; k < n; k++) {
      for (let l = 0; l < n; l++) {
        if (k !== l) {
          let concordanceSum = 0;
          let maxDiff = 0;
          let maxAllDiff = 0;

          for (let j = 0; j < criteria.length; j++) {
            const vk = parseFloat(weighted[j][k].weighted);
            const vl = parseFloat(weighted[j][l].weighted);
            const diff = Math.abs(vk - vl);
            
            maxAllDiff = Math.max(maxAllDiff, diff);

            if (criteria[j].type === 'benefit' && vk >= vl) {
              concordanceSum += criteria[j].weight;
            } else if (criteria[j].type === 'cost' && vk <= vl) {
              concordanceSum += criteria[j].weight;
            }

            if (criteria[j].type === 'benefit' && vk < vl) {
              maxDiff = Math.max(maxDiff, diff);
            } else if (criteria[j].type === 'cost' && vk > vl) {
              maxDiff = Math.max(maxDiff, diff);
            }
          }

          concordanceMatrix[k][l] = concordanceSum.toFixed(2);
          discordanceMatrix[k][l] = maxAllDiff > 0 ? (maxDiff / maxAllDiff).toFixed(2) : 0;
        }
      }
    }

    let cSum = 0, dSum = 0, count = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          cSum += parseFloat(concordanceMatrix[i][j]);
          dSum += parseFloat(discordanceMatrix[i][j]);
          count++;
        }
      }
    }
    const cThreshold = (cSum / count).toFixed(2);
    const dThreshold = (dSum / count).toFixed(2);

    const dominantC = Array(n).fill(0).map(() => Array(n).fill(0));
    const dominantD = Array(n).fill(0).map(() => Array(n).fill(0));
    const aggregate = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          dominantC[i][j] = parseFloat(concordanceMatrix[i][j]) >= parseFloat(cThreshold) ? 1 : 0;
          dominantD[i][j] = parseFloat(discordanceMatrix[i][j]) <= parseFloat(dThreshold) ? 1 : 0;
          aggregate[i][j] = dominantC[i][j] * dominantD[i][j];
        }
      }
    }

    const netScores = alternatives.map((alt, idx) => {
      const dominates = aggregate[idx].reduce((sum, val) => sum + val, 0);
      const dominated = aggregate.map(row => row[idx]).reduce((sum, val) => sum + val, 0);
      return {
        name: alt.name,
        dominates,
        dominated,
        netScore: dominates - dominated
      };
    });

    return {
      normalized,
      weighted,
      concordanceMatrix,
      discordanceMatrix,
      cThreshold,
      dThreshold,
      dominantC,
      dominantD,
      aggregate,
      netScores: netScores.sort((a, b) => b.netScore - a.netScore)
    };
  };

  const pmResults = calculateProfileMatching();
  const electreResults = calculateElectre();

  const toggleDetails = (key) => {
    setShowDetails(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWeightChange = (index, value) => {
    const newCriteria = [...criteria];
    newCriteria[index].weight = parseFloat(value) || 0;
    setCriteria(newCriteria);
  };

  const handleIdealChange = (index, value) => {
    const newCriteria = [...criteria];
    newCriteria[index].ideal = parseInt(value) || 1;
    setCriteria(newCriteria);
  };

  const resetWeights = () => {
    setCriteria([
      { name: 'Kesesuaian organik', weight: 0.15, ideal: 5, type: 'benefit' },
      { name: 'Kapasitas', weight: 0.12, ideal: 5, type: 'benefit' },
      { name: 'Lahan', weight: 0.08, ideal: 5, type: 'cost' },
      { name: 'Teknologi', weight: 0.10, ideal: 5, type: 'benefit' },
      { name: 'Fleksibilitas', weight: 0.07, ideal: 4, type: 'benefit' },
      { name: 'Reduksi GRK', weight: 0.12, ideal: 5, type: 'benefit' },
      { name: 'Risiko pencemaran', weight: 0.10, ideal: 5, type: 'cost' },
      { name: 'Circular economy', weight: 0.08, ideal: 5, type: 'benefit' },
      { name: 'Regulasi', weight: 0.06, ideal: 5, type: 'benefit' },
      { name: 'CAPEX', weight: 0.08, ideal: 5, type: 'cost' },
      { name: 'OPEX', weight: 0.07, ideal: 5, type: 'cost' },
      { name: 'Pendapatan', weight: 0.06, ideal: 5, type: 'benefit' },
      { name: 'Penerimaan', weight: 0.05, ideal: 5, type: 'benefit' },
      { name: 'Lapangan kerja', weight: 0.04, ideal: 4, type: 'benefit' },
      { name: 'Kebijakan', weight: 0.05, ideal: 5, type: 'benefit' },
      { name: 'SDM', weight: 0.05, ideal: 3, type: 'cost' }
    ]);
  };

  const getTotalWeight = () => {
    return criteria.reduce((sum, crit) => sum + crit.weight, 0).toFixed(2);
  };

  return (
    <div className="waste-dss-container">
      <div className="waste-dss-wrapper">
        {/* Header */}
        <div className="dss-header">
          <h1>Sistem Pendukung Keputusan Pemilihan Teknologi Pengolahan Sampah</h1>
          <p>Kota Depok - Menggunakan Profile Matching & ELECTRE</p>
        </div>

        {/* Navigation */}
        <div className="dss-nav">
          <div className="dss-nav-container">
            {['home', 'weights', 'data', 'profile-matching', 'electre', 'comparison'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`dss-tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'home' && 'Beranda'}
                {tab === 'weights' && 'Bobot Kriteria'}
                {tab === 'data' && 'Data'}
                {tab === 'profile-matching' && 'Profile Matching'}
                {tab === 'electre' && 'ELECTRE'}
                {tab === 'comparison' && 'Perbandingan'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="dss-content">
          {activeTab === 'home' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Gambaran Umum Sistem</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-700 mb-3">Profil Kota Depok</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Timbulan sampah: <strong>1.300 ton/hari</strong></li>
                    <li>• Komposisi organik: <strong>63,59%</strong></li>
                    <li>• Kapasitas TPA: <strong>900-1.000 ton/hari</strong></li>
                    <li>• Status: <strong>OVERLOAD</strong></li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-green-700 mb-3">Alternatif Teknologi</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Landfill</li>
                    <li>• Komposting</li>
                    <li>• Anaerobic Digestion (Biogas)</li>
                    <li>• Waste-to-Energy (WTE)</li>
                    <li>• Gasifikasi/Pirolisis</li>
                    <li>• RDF (Refuse-Derived Fuel)</li>
                    <li>• Daur Ulang Mekanis</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'weights' && (
            <div className="space-y-6">
              <div className="weight-controls">
                <h2 className="dss-section-title">Pengaturan Bobot Kriteria</h2>
                <div className="weight-buttons">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`btn-edit ${editMode ? 'edit-mode' : ''}`}
                  >
                    {editMode ? '🔒 Selesai Edit' : '✏️ Edit Bobot'}
                  </button>
                  <button onClick={resetWeights} className="btn-reset">
                    🔄 Reset Default
                  </button>
                </div>
              </div>

              {/* Info Total Bobot */}
              <div className={`weight-total-box ${getTotalWeight() === '1.00' ? 'valid' : 'invalid'}`}>
                <div className="weight-total-row">
                  <span className="weight-total-label">Total Bobot:</span>
                  <span className={`weight-total-value ${getTotalWeight() === '1.00' ? 'valid' : 'invalid'}`}>
                    {(getTotalWeight() * 100).toFixed(0)}%
                  </span>
                </div>
                {getTotalWeight() !== '1.00' && (
                  <p className="weight-error-message">
                    ⚠️ Total bobot harus 100% (1.00). Saat ini: {(getTotalWeight() * 100).toFixed(0)}%
                  </p>
                )}
              </div>

              {/* Tabel Input Bobot */}
              <div className="overflow-x-auto">
                <table className="dss-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kriteria</th>
                      <th className="text-center">Tipe</th>
                      <th className="text-center">Bobot (%)</th>
                      <th className="text-center">Bobot Desimal</th>
                      <th className="text-center">Nilai Ideal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((crit, idx) => (
                      <tr key={idx}>
                        <td className="text-center font-bold">{idx + 1}</td>
                        <td>{crit.name}</td>
                        <td className="text-center">
                          <span className={`badge ${crit.type === 'benefit' ? 'badge-benefit' : 'badge-cost'}`}>
                            {crit.type}
                          </span>
                        </td>
                        <td>
                          {editMode ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={(crit.weight * 100).toFixed(0)}
                              onChange={(e) => handleWeightChange(idx, e.target.value / 100)}
                              className="dss-input"
                            />
                          ) : (
                            <span className="block text-center font-bold text-lg">
                              {(crit.weight * 100).toFixed(0)}%
                            </span>
                          )}
                        </td>
                        <td className="text-center font-mono text-sm">
                          {crit.weight.toFixed(2)}
                        </td>
                        <td>
                          {editMode ? (
                            <input
                              type="number"
                              min="1"
                              max="5"
                              step="1"
                              value={crit.ideal}
                              onChange={(e) => handleIdealChange(idx, e.target.value)}
                              className="dss-input"
                            />
                          ) : (
                            <span className="block text-center font-bold text-lg">
                              {crit.ideal}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="3" className="text-right">TOTAL:</td>
                      <td className="text-center text-xl">
                        <span className={getTotalWeight() === '1.00' ? 'text-green-600' : 'text-red-600'}>
                          {(getTotalWeight() * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-center text-lg font-mono">
                        {getTotalWeight()}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Visualisasi Bobot */}
              <div className="viz-container">
                <h3 className="viz-title">Visualisasi Distribusi Bobot</h3>
                <div className="viz-bar-wrapper">
                  {criteria.map((crit, idx) => {
                    const percentage = crit.weight * 100;
                    return (
                      <div key={idx} className="viz-bar-row">
                        <div className="viz-bar-label">
                          <span>{crit.name}</span>
                        </div>
                        <div className="viz-bar-track">
                          <div className="viz-bar-fill" style={{ width: `${percentage}%` }}>
                            {percentage >= 5 && (
                              <span className="viz-bar-text">{percentage.toFixed(0)}%</span>
                            )}
                          </div>
                        </div>
                        {percentage < 5 && (
                          <span className="viz-bar-text-outside">
                            {percentage.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Penjelasan */}
              <div className="info-box">
                <h4 className="info-box-title">📝 Petunjuk:</h4>
                <ul>
                  <li>• Klik tombol <strong>"✏️ Edit Bobot"</strong> untuk mengubah nilai bobot dan ideal</li>
                  <li>• <strong>Total bobot harus 100%</strong> (1.00 dalam desimal)</li>
                  <li>• <strong>Benefit:</strong> Semakin tinggi semakin baik (contoh: Kapasitas, Pendapatan)</li>
                  <li>• <strong>Cost:</strong> Semakin rendah semakin baik (contoh: CAPEX, OPEX, Risiko)</li>
                  <li>• <strong>Nilai Ideal:</strong> Nilai profil ideal untuk Profile Matching (skala 1-5)</li>
                  <li>• Klik <strong>"🔄 Reset Default"</strong> untuk mengembalikan ke nilai awal</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="dss-section-title">Data Kriteria dan Penilaian</h2>
              <div className="overflow-x-auto">
                <table className="dss-table table-blue">
                  <thead>
                    <tr>
                      <th>Kriteria</th>
                      <th className="text-center">Bobot</th>
                      <th className="text-center">Ideal</th>
                      <th className="text-center">Tipe</th>
                      {alternatives.map(alt => (
                        <th key={alt.name} className="text-center">{alt.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((crit, idx) => (
                      <tr key={idx}>
                        <td>{crit.name}</td>
                        <td className="text-center">{(crit.weight * 100).toFixed(0)}%</td>
                        <td className="text-center">{crit.ideal}</td>
                        <td className="text-center">
                          <span className={`badge ${crit.type === 'benefit' ? 'badge-benefit' : 'badge-cost'}`}>
                            {crit.type}
                          </span>
                        </td>
                        {alternatives.map(alt => (
                          <td key={alt.name} className="text-center">{alt.values[idx]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile-matching' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Matching - Detail Perhitungan</h2>
              
              {/* Hasil Ranking */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Hasil Ranking</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {pmResults.map((result, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${
                      idx === 0 ? 'bg-yellow-100 border-2 border-yellow-400' :
                      idx === 1 ? 'bg-gray-100 border-2 border-gray-400' :
                      idx === 2 ? 'bg-orange-100 border-2 border-orange-400' :
                      'bg-white border border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">#{idx + 1} {result.name}</span>
                        <span className="text-2xl font-bold text-green-600">{result.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail per Alternatif */}
              {pmResults.map((result, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleDetails(`pm-${idx}`)}
                    className="w-full bg-green-100 hover:bg-green-200 p-4 text-left font-bold flex justify-between items-center transition-colors"
                  >
                    <span>#{idx + 1} {result.name} - Score: {result.score}</span>
                    <span>{showDetails[`pm-${idx}`] ? '▼' : '▶'}</span>
                  </button>
                  
                  {showDetails[`pm-${idx}`] && (
                    <div className="p-4 bg-gray-50">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Kriteria</th>
                            <th className="border p-2">Nilai</th>
                            <th className="border p-2">Ideal</th>
                            <th className="border p-2">GAP</th>
                            <th className="border p-2">Konversi</th>
                            <th className="border p-2">Bobot</th>
                            <th className="border p-2">Terbobot</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.details.map((detail, dIdx) => (
                            <tr key={dIdx} className="hover:bg-white">
                              <td className="border p-2">{detail.criteria}</td>
                              <td className="border p-2 text-center">{detail.value}</td>
                              <td className="border p-2 text-center">{detail.ideal}</td>
                              <td className="border p-2 text-center">
                                <span className={`px-2 py-1 rounded ${
                                  detail.gap === 0 ? 'bg-green-100 text-green-700' :
                                  detail.gap > 0 ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {detail.gap > 0 ? '+' : ''}{detail.gap}
                                </span>
                              </td>
                              <td className="border p-2 text-center font-medium">{detail.converted}</td>
                              <td className="border p-2 text-center">{(detail.weight * 100).toFixed(0)}%</td>
                              <td className="border p-2 text-center font-bold text-green-600">{detail.weighted}</td>
                            </tr>
                          ))}
                          <tr className="bg-green-100 font-bold">
                            <td colSpan="6" className="border p-2 text-right">TOTAL SCORE:</td>
                            <td className="border p-2 text-center text-lg">{result.score}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {/* Chart */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Visualisasi Hasil</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={pmResults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8FD9FB" name="Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'electre' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">ELECTRE - Detail Perhitungan</h2>

              {/* Hasil Ranking */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Hasil Ranking ELECTRE</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {electreResults.netScores.map((result, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${
                      idx === 0 ? 'bg-yellow-100 border-2 border-yellow-400' :
                      idx === 1 ? 'bg-gray-100 border-2 border-gray-400' :
                      idx === 2 ? 'bg-orange-100 border-2 border-orange-400' :
                      'bg-white border border-gray-200'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">#{idx + 1} {result.name}</span>
                        <span className="text-2xl font-bold text-blue-600">{result.netScore > 0 ? '+' : ''}{result.netScore}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Mendominasi: {result.dominates} | Didominasi: {result.dominated}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matriks sections dengan toggle */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleDetails('electre-norm')}
                  className="w-full bg-blue-100 hover:bg-blue-200 p-4 text-left font-bold flex justify-between items-center transition-colors"
                >
                  <span>1️⃣ Matriks Ternormalisasi</span>
                  <span>{showDetails['electre-norm'] ? '▼' : '▶'}</span>
                </button>
                
                {showDetails['electre-norm'] && (
                  <div className="p-4 bg-gray-50 overflow-x-auto">
                    <p className="text-sm text-gray-600 mb-3">Rumus: r_ij = x_ij / √(Σ x²_ij)</p>
                    {electreResults.normalized.slice(0, 5).map((crit, idx) => (
                      <div key={idx} className="mb-4">
                        <h4 className="font-bold text-sm mb-2">{criteria[idx].name}</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border p-2">Alternatif</th>
                              <th className="border p-2">Nilai Asli</th>
                              <th className="border p-2">Ternormalisasi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {crit.map((item, i) => (
                              <tr key={i}>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2 text-center">{item.original}</td>
                                <td className="border p-2 text-center font-mono">{item.normalized}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Concordance/Discordance sections */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleDetails('electre-concord')}
                  className="w-full bg-blue-100 hover:bg-blue-200 p-4 text-left font-bold flex justify-between items-center transition-colors"
                >
                  <span>3️⃣ Matriks Concordance (Threshold: {electreResults.cThreshold})</span>
                  <span>{showDetails['electre-concord'] ? '▼' : '▶'}</span>
                </button>
                
                {showDetails['electre-concord'] && (
                  <div className="p-4 bg-gray-50 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border p-2">Alt</th>
                          {alternatives.map(alt => (
                            <th key={alt.name} className="border p-2">{alt.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {electreResults.concordanceMatrix.map((row, i) => (
                          <tr key={i}>
                            <td className="border p-2 font-bold">{alternatives[i].name}</td>
                            {row.map((val, j) => (
                              <td key={j} className={`border p-2 text-center ${
                                i === j ? 'bg-gray-300' :
                                parseFloat(val) >= parseFloat(electreResults.cThreshold) ? 'bg-green-100 font-bold' :
                                'bg-white'
                              }`}>
                                {i === j ? '-' : val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Chart ELECTRE */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Visualisasi Net Score</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={electreResults.netScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="dominates" fill="#96c09f" name="Mendominasi" />
                    <Bar dataKey="dominated" fill="#FF746C" name="Didominasi" />
                    <Bar dataKey="netScore" fill="#8FD9FB" name="Net Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <h2 className="dss-section-title">Perbandingan Hasil Kedua Metode</h2>

              {/* Tabel Perbandingan */}
              <div className="overflow-x-auto">
                <table className="dss-table">
                  <thead>
                    <tr>
                      <th>Alternatif</th>
                      <th className="text-center">Ranking PM</th>
                      <th className="text-center">Score PM</th>
                      <th className="text-center">Ranking ELECTRE</th>
                      <th className="text-center">Net Score ELECTRE</th>
                      <th className="text-center">Konsensus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alternatives.map(alt => {
                      const pmRank = pmResults.findIndex(r => r.name === alt.name) + 1;
                      const pmScore = pmResults.find(r => r.name === alt.name).score;
                      const electreRank = electreResults.netScores.findIndex(r => r.name === alt.name) + 1;
                      const electreScore = electreResults.netScores.find(r => r.name === alt.name).netScore;
                      const avgRank = (pmRank + electreRank) / 2;
                      
                      return (
                        <tr key={alt.name} className={avgRank <= 3 ? 'bg-green-50' : ''}>
                          <td className="font-bold">{alt.name}</td>
                          <td className="text-center">#{pmRank}</td>
                          <td className="text-center">{pmScore}</td>
                          <td className="text-center">#{electreRank}</td>
                          <td className="text-center">{electreScore > 0 ? '+' : ''}{electreScore}</td>
                          <td className="text-center">
                            <span className={`comparison-badge ${
                              avgRank <= 2 ? 'top' :
                              avgRank <= 3 ? 'high' :
                              avgRank <= 5 ? 'medium' : 'low'
                            }`}>
                              {avgRank <= 2 ? '⭐ Top Prioritas' :
                               avgRank <= 3 ? '✅ Prioritas Tinggi' :
                               avgRank <= 5 ? '📌 Prioritas Sedang' :
                               '⚠️ Tidak Prioritas'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Radar Chart */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Perbandingan Multi-Kriteria (Top 3)</h3>
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={criteria.slice(0, 8).map((crit, idx) => ({
                    criteria: crit.name,
                    Komposting: alternatives[1].values[idx],
                    'Daur Ulang': alternatives[6].values[idx],
                    'AD/Biogas': alternatives[2].values[idx]
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="criteria" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar name="Komposting" dataKey="Komposting" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                    <Radar name="Daur Ulang" dataKey="Daur Ulang" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Radar name="AD/Biogas" dataKey="AD/Biogas" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-lg p-4 mt-6 text-center text-gray-600">
          <p>© 2025 Kelompok 7 - SPK-B | Teknik Informatika | Universitas Pancasila</p>
        </div>
      </div>
    </div>
  );
};

export default WasteManagementDSS;