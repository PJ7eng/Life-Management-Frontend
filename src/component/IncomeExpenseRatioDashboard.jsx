import React, { useState } from 'react';
import '../component_styles/IncomeExpenseRatioDashboard.css';

const dataMap = {
  day: { expense: 100, income: 100 },
  month: { expense: 3000, income: 5000 },
  year: { expense: 36000, income: 60000 },
};

const COLORS = ['#60a5fa', '#2563eb'];

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function DonutChart({ expense, income }) {
  const total = expense + income;
  const expensePercent = total === 0 ? 0.5 : expense / total;
  const incomePercent = total === 0 ? 0.5 : income / total;
  const expenseAngle = expensePercent * 360;
  const incomeAngle = incomePercent * 360;

  return (
    <svg width="200" height="200" viewBox="0 0 140 140">
      <g>
        {/* Expense Arc */}
        <path
          d={describeArc(70, 70, 50, 0, expenseAngle)}
          fill="none"
          stroke={COLORS[0]}
          strokeWidth="30"
          strokeLinecap="butt"
        />
        {/* Income Arc */}
        <path
          d={describeArc(70, 70, 50, expenseAngle, 360)}
          fill="none"
          stroke={COLORS[1]}
          strokeWidth="30"
          strokeLinecap="butt"
        />
      </g>
      <circle cx="70" cy="70" r="35" fill="#fff" />
    </svg>
  );
}

function IncomeExpenseRatioDashboard() {
  const [mode, setMode] = useState('day');
  const { expense, income } = dataMap[mode];

  return (
    <div className="income-expense-dashboard">
      <div className="dashboard-header">
        <span className="dashboard-title">收支比例</span>
        <div className="dashboard-tabs">
          {['day', 'month', 'year'].map((m, i) => (
            <button
              key={m}
              className={`dashboard-tab${mode === m ? ' active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'day' ? '日' : m === 'month' ? '月' : '年'}
            </button>
          ))}
        </div>
      </div>
      <div className="dashboard-content">
        <DonutChart expense={expense} income={income} />
        <div className="dashboard-legend">
          <div className="legend-item">
            <span className="legend-dot expense" />
            支出：${expense}
          </div>
          <div className="legend-item">
            <span className="legend-dot income" />
            收入：${income}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeExpenseRatioDashboard; 