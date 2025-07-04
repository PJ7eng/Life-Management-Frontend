import { useState, useEffect } from 'react';

import api from '../api';

import '../component_styles/MainContent.css';
import '../component_styles/Memo.css';

function Memo() {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMemoEditor, setShowMemoEditor] = useState(false);
  const [currentMemo, setCurrentMemo] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // 获取用户的所有备忘录
  const fetchMemos = async () => {
    try {
      const response = await api.get('/memos');
      setMemos(response.data.map(memo => ({
        ...memo,
        selected: false,
        lastEditDate: memo.updated_at || memo.created_at
      })));
    } catch (error) {
      console.error('获取备忘录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  // 切换编辑模式
  const toggleEditMode = () => {
    setIsEditing(!isEditing);

    // 退出编辑模式时重置所有选择状态
    if (isEditing) {
      const resetMemos = memos.map(memo => ({
        ...memo,
        selected: false
      }));
      setMemos(resetMemos);
    }
  };

  // 选择/取消选择单个卡片
  const toggleMemoSelection = (id) => {
    const updatedMemos = memos.map(memo =>
      memo.id === id ? { ...memo, selected: !memo.selected } : memo
    );
    setMemos(updatedMemos);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allSelected = memos.every(memo => memo.selected);
    const updatedMemos = memos.map(memo => ({
      ...memo,
      selected: !allSelected
    }));
    setMemos(updatedMemos);
  };

  // 删除选中的卡片
  // const deleteSelectedMemos = () => {
  //   const remainingMemos = memos.filter(memo => !memo.selected);
  //   setMemos(remainingMemos);
  //   setIsEditing(false);
  //   setShowDeleteConfirm(false);
  // };

  // 删除选中的备忘录
  const deleteSelectedMemos = async () => {
    const memoIds = memos
      .filter(memo => memo.selected)
      .map(memo => memo.id);

    if (memoIds.length === 0) return;
    try {
      await api.delete('/memos', {
        data: { memo_ids: memoIds }
      });

      // 更新本地狀態
      const remainingMemos = memos.filter(memo => !memo.selected);
      setMemos(remainingMemos);
      setIsEditing(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('删除备忘录失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 获取选中的卡片数量
  const selectedCount = memos.filter(memo => memo.selected).length;

  // 打开新增备忘录表单
  const openNewMemoForm = () => {
    setCurrentMemo(null);
    setFormData({ title: '', content: '' });
    setShowMemoEditor(true);
  };

  // 打开编辑备忘录表单
  const openEditMemoForm = (memo) => {
    if (isEditing) return; // 编辑模式下不能编辑单个备忘录

    setCurrentMemo(memo);
    setFormData({
      title: memo.title,
      content: memo.content
    });
    setShowMemoEditor(true);
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 保存备忘录
  const saveMemo = async () => {
    try {
      if (currentMemo) {
        // 更新现有备忘录
        const response = await api.put(`/memos/${currentMemo.id}`, {
          title: formData.title,
          content: formData.content,
          color: formData.color || currentMemo.color
        });

        // 更新本地状态
        const updatedMemos = memos.map(memo =>
          memo.id === currentMemo.id ? response.data : memo
        );
        setMemos(updatedMemos);
      } else {
        // 新增备忘录
        const response = await api.post('/memos', {
          title: formData.title,
          content: formData.content,
          color: getRandomColor()
        });

        // 添加到本地状态
        setMemos([...memos, {
          ...response.data,
          selected: false,
          lastEditDate: new Date().toISOString()
        }]);
      }

      setShowMemoEditor(false);
    } catch (error) {
      console.error('保存备忘录失败:', error);
      alert('保存失败，请重试');
    }
  };

  // 生成随机颜色
  const getRandomColor = () => {
    const colors = ['#FFEE93', '#ADF7B6', '#FFD6E0', '#C1E7FF', '#E6D3FF', '#FFFACD', '#D1FFBD', '#FFD8B1', '#E0F7FA'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className='main-page'>
      <div className='Memo-edit-bar'>
        {isEditing ? (
          <div className="edit-controls">
            <div className="select-all" onClick={toggleSelectAll}>
              <div className={`checkbox ${selectedCount === memos.length ? 'checked' : ''}`}>
                {selectedCount === memos.length && <span>✓</span>}
              </div>
              <span>全部</span>
            </div>
            <div className="selected-count">已選擇 {selectedCount} 個</div>
            <button
              className="delete-button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={selectedCount === 0}
            >
              刪除
            </button>
            <button className="cancel-button" onClick={toggleEditMode}>
              完成
            </button>
          </div>
        ) : (
          <div className="normal-controls">
            <button className="add-button" onClick={openNewMemoForm}>
              新增
            </button>
            <button className="edit-button" onClick={toggleEditMode}>
              編輯
            </button>
          </div>
        )}
      </div>

      <div className='Memo-container'>
        {memos.map(memo => (
          <div
            key={memo.id}
            className='memo-card'
            style={{ backgroundColor: memo.color }}
            onClick={() => openEditMemoForm(memo)}
          >
            {isEditing && (
              <div
                className="memo-checkbox"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMemoSelection(memo.id);
                }}
              >
                <div className={`checkbox ${memo.selected ? 'checked' : ''}`}>
                  {memo.selected && <span>✓</span>}
                </div>
              </div>
            )}
            <h1>{memo.title}</h1>
            <div className="memo-date">最後編輯: {formatDate(memo.lastEditDate)}</div>
            <pre>{memo.content}</pre>
          </div>
        ))}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <h3>確認刪除</h3>
            <p>確定要刪除選中的 {selectedCount} 個備忘錄嗎？</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={deleteSelectedMemos}>
                是
              </button>
              <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>
                否
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 备忘录编辑器 */}
      {showMemoEditor && (
        <div className="memo-editor-modal">
          <div className="editor-content">
            <h2>{currentMemo ? '編輯備忘錄' : '新增備忘錄'}</h2>

            <div className="form-group">
              <label>標題</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="輸入標題"
              />
            </div>

            <div className="form-group">
              <label>內容</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="輸入內容"
                rows={8}
              />
            </div>

            <div className="editor-actions">
              <button className="save-button" onClick={saveMemo}>
                保存
              </button>
              <button className="cancel-button" onClick={() => setShowMemoEditor(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Memo;