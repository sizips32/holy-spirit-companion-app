// 성령과 동행하는 삶 - Holy Spirit Companion App JavaScript

class HolySpiritCompanionApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentPractice = 'bible-reading';
        this.stages = ['인식', '순종', '동행', '사역'];
        this.currentStage = 1; // 0-3 인덱스
        this.totalScore = 0;
        this.maxScore = 200;

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadStoredData();
        this.updateDashboard();
        this.initializeAssessment();
        this.showTab('dashboard');
    }

    setupEventListeners() {
        // 탭 네비게이션
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showTab(e.target.dataset.tab);
            });
        });

        // 하단 네비게이션 (모바일)
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTab(e.target.closest('.bottom-nav-item').dataset.tab);
            });
        });

        // 실천 가이드 네비게이션
        document.querySelectorAll('.practice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showPractice(e.target.dataset.practice);
            });
        });

        // 체크리스트 항목
        document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateChecklistItem(e.target);
                this.updateDashboard();
                this.saveData();
            });
        });

        // 평가 슬라이더
        document.querySelectorAll('.assessment-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateAssessmentScore(e.target);
            });
            slider.addEventListener('change', (e) => {
                this.saveData();
            });
        });

        // 저널 모달
        const newEntryBtn = document.getElementById('newEntryBtn');
        const journalModal = document.getElementById('journalModal');
        const closeModalBtn = document.querySelector('.close-btn');
        const saveEntryBtn = document.getElementById('saveEntryBtn');

        if (newEntryBtn) {
            newEntryBtn.addEventListener('click', () => {
                this.openJournalModal();
            });
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeJournalModal();
            });
        }

        if (journalModal) {
            journalModal.addEventListener('click', (e) => {
                if (e.target === journalModal) {
                    this.closeJournalModal();
                }
            });
        }

        if (saveEntryBtn) {
            saveEntryBtn.addEventListener('click', () => {
                this.saveJournalEntry();
            });
        }

        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeJournalModal();
            }
        });
    }

    showTab(tabName) {
        // 탭 버튼 활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // 하단 네비게이션 활성화
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabName) {
                item.classList.add('active');
            }
        });

        // 탭 컨텐츠 표시
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}Tab`) {
                content.classList.add('active');
            }
        });

        this.currentTab = tabName;

        // 탭별 초기화
        switch (tabName) {
            case 'assessment':
                this.updateAssessmentDisplay();
                break;
            case 'practice':
                this.showPractice(this.currentPractice);
                break;
            case 'journal':
                this.loadJournalEntries();
                break;
        }
    }

    showPractice(practiceName) {
        // 실천 가이드 버튼 활성화
        document.querySelectorAll('.practice-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.practice === practiceName) {
                btn.classList.add('active');
            }
        });

        // 실천 가이드 컨텐츠 표시
        document.querySelectorAll('.practice-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${practiceName}Practice`) {
                content.classList.add('active');
            }
        });

        this.currentPractice = practiceName;
    }

    updateDashboard() {
        // 현재 단계 표시
        const stageDisplay = document.querySelector('.current-stage');
        const stageDescription = document.querySelector('.stage-description');

        if (stageDisplay) {
            stageDisplay.textContent = `${this.currentStage + 1}단계: ${this.stages[this.currentStage]}`;
        }

        const descriptions = [
            '성령의 존재와 역할을 깨닫고 인정하는 단계입니다. 매일 성령님을 의식하며 살아가기 시작합니다.',
            '성령의 음성에 순종하며 구체적인 변화를 경험하는 단계입니다. 죄를 끊고 새로운 습관을 형성합니다.',
            '성령과 깊은 교제를 나누며 일상에서 지속적인 인도를 받는 단계입니다. 성령의 열매가 자연스럽게 나타납니다.',
            '성령의 능력으로 다른 사람들을 섬기고 하나님의 사랑을 전하는 단계입니다. 영적 은사를 활용하여 사역합니다.'
        ];

        if (stageDescription) {
            stageDescription.textContent = descriptions[this.currentStage];
        }

        // 진행률 표시
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = ((this.currentStage + 1) / this.stages.length) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // 체크리스트 통계
        const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');

        const completionRate = checklistItems.length > 0 ?
            Math.round((completedItems.length / checklistItems.length) * 100) : 0;

        // 통계 업데이트
        this.updateStatistic('completion-rate', `${completionRate}%`);
        this.updateStatistic('current-stage-num', this.currentStage + 1);
        this.updateStatistic('total-score', this.totalScore);
        this.updateStatistic('days-journey', this.calculateJourneyDays());
    }

    updateStatistic(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    calculateJourneyDays() {
        const startDate = localStorage.getItem('journey-start-date');
        if (!startDate) {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('journey-start-date', today);
            return 1;
        }

        const start = new Date(startDate);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    updateChecklistItem(checkbox) {
        const listItem = checkbox.closest('.checklist-item');
        if (checkbox.checked) {
            listItem.classList.add('completed');
        } else {
            listItem.classList.remove('completed');
        }
    }

    initializeAssessment() {
        const sliders = document.querySelectorAll('.assessment-slider');
        sliders.forEach(slider => {
            this.updateSliderDisplay(slider);
        });
        this.calculateTotalScore();
    }

    updateAssessmentScore(slider) {
        this.updateSliderDisplay(slider);
        this.calculateTotalScore();
        this.updateAssessmentDisplay();
    }

    updateSliderDisplay(slider) {
        const value = parseInt(slider.value);
        const scoreDisplay = slider.parentElement.querySelector('.score-display');
        if (scoreDisplay) {
            scoreDisplay.textContent = `${value}/10`;
        }
    }

    calculateTotalScore() {
        const sliders = document.querySelectorAll('.assessment-slider');
        let total = 0;
        sliders.forEach(slider => {
            total += parseInt(slider.value);
        });
        this.totalScore = total;

        // 단계 자동 업데이트 (점수 기반)
        if (this.totalScore >= 160) {
            this.currentStage = 3; // 사역
        } else if (this.totalScore >= 120) {
            this.currentStage = 2; // 동행
        } else if (this.totalScore >= 80) {
            this.currentStage = 1; // 순종
        } else {
            this.currentStage = 0; // 인식
        }
    }

    updateAssessmentDisplay() {
        // 총점 표시
        const totalScoreElement = document.getElementById('totalAssessmentScore');
        if (totalScoreElement) {
            totalScoreElement.textContent = `${this.totalScore}/${this.maxScore}`;
        }

        // 카테고리별 점수 계산
        const categories = ['relationship', 'character', 'discernment', 'ministry'];
        categories.forEach(category => {
            const categorySliders = document.querySelectorAll(`[data-category="${category}"]`);
            let categoryTotal = 0;
            categorySliders.forEach(slider => {
                categoryTotal += parseInt(slider.value);
            });

            const categoryScore = document.getElementById(`${category}Score`);
            if (categoryScore) {
                categoryScore.textContent = `${categoryTotal}/50`;
            }
        });

        // 추천 사항 업데이트
        this.updateRecommendations();
    }

    updateRecommendations() {
        const recommendationsElement = document.getElementById('recommendations');
        if (!recommendationsElement) return;

        let recommendations = [];

        if (this.totalScore < 80) {
            recommendations.push('매일 성령님께 기도하며 하루를 시작하세요.');
            recommendations.push('성경 읽기를 통해 성령의 음성을 듣는 연습을 하세요.');
        } else if (this.totalScore < 120) {
            recommendations.push('성령의 인도하심에 순종하는 구체적인 실천을 늘려가세요.');
            recommendations.push('죄에 대한 민감성을 기르고 즉시 회개하는 습관을 만드세요.');
        } else if (this.totalScore < 160) {
            recommendations.push('성령의 열매가 일상에서 자연스럽게 나타나도록 노력하세요.');
            recommendations.push('다른 사람들과 함께 성령의 역사를 나누고 격려하세요.');
        } else {
            recommendations.push('성령의 은사를 활용하여 적극적으로 사역에 참여하세요.');
            recommendations.push('새신자나 어려움을 겪는 분들을 멘토링하세요.');
        }

        recommendationsElement.innerHTML = recommendations
            .map(rec => `<li>${rec}</li>`)
            .join('');
    }

    openJournalModal() {
        const modal = document.getElementById('journalModal');
        if (modal) {
            modal.classList.add('active');

            // 오늘 날짜로 설정
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('entryDate');
            if (dateInput) {
                dateInput.value = today;
            }

            // 제목 입력란에 포커스
            const titleInput = document.getElementById('entryTitle');
            if (titleInput) {
                titleInput.focus();
            }
        }
    }

    closeJournalModal() {
        const modal = document.getElementById('journalModal');
        if (modal) {
            modal.classList.remove('active');
            this.clearJournalForm();
        }
    }

    clearJournalForm() {
        const form = document.getElementById('journalForm');
        if (form) {
            form.reset();
        }
    }

    saveJournalEntry() {
        const date = document.getElementById('entryDate').value;
        const title = document.getElementById('entryTitle').value.trim();
        const type = document.getElementById('entryType').value;
        const content = document.getElementById('entryContent').value.trim();

        if (!title || !content) {
            alert('제목과 내용을 모두 입력해 주세요.');
            return;
        }

        const entry = {
            id: Date.now(),
            date,
            title,
            type,
            content,
            timestamp: new Date().toISOString()
        };

        // 로컬 스토리지에 저장
        const entries = this.getJournalEntries();
        entries.unshift(entry); // 최신 항목을 맨 앞에 추가
        localStorage.setItem('journal-entries', JSON.stringify(entries));

        this.closeJournalModal();
        this.loadJournalEntries();

        // 성공 메시지
        this.showNotification('저널이 저장되었습니다.');
    }

    getJournalEntries() {
        const stored = localStorage.getItem('journal-entries');
        return stored ? JSON.parse(stored) : [];
    }

    loadJournalEntries() {
        const entries = this.getJournalEntries();
        const container = document.getElementById('journalEntries');

        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align: center; color: var(--text-secondary);">
                    <p>아직 작성된 저널이 없습니다.</p>
                    <p>첫 번째 저널을 작성해 보세요!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="journal-entry">
                <div class="entry-date">${this.formatDate(entry.date)} • ${this.getTypeLabel(entry.type)}</div>
                <div class="entry-title">${entry.title}</div>
                <div class="entry-content">${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}</div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    }

    getTypeLabel(type) {
        const labels = {
            'daily': '일상 묵상',
            'prayer': '기도 응답',
            'challenge': '도전과 극복',
            'insight': '깨달음과 은혜',
            'gratitude': '감사와 찬양'
        };
        return labels[type] || type;
    }

    showNotification(message) {
        // 간단한 알림 표시 (실제 구현에서는 더 예쁜 토스트 알림 사용 가능)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            z-index: 10000;
            animation: slideInRight 0.3s ease-in-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    saveData() {
        const data = {
            currentStage: this.currentStage,
            totalScore: this.totalScore,
            checklistStates: this.getChecklistStates(),
            assessmentScores: this.getAssessmentScores(),
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('holy-spirit-companion-data', JSON.stringify(data));
    }

    loadStoredData() {
        const stored = localStorage.getItem('holy-spirit-companion-data');
        if (stored) {
            const data = JSON.parse(stored);
            this.currentStage = data.currentStage || 0;
            this.totalScore = data.totalScore || 0;

            // 체크리스트 상태 복원
            if (data.checklistStates) {
                Object.entries(data.checklistStates).forEach(([id, checked]) => {
                    const checkbox = document.getElementById(id);
                    if (checkbox) {
                        checkbox.checked = checked;
                        this.updateChecklistItem(checkbox);
                    }
                });
            }

            // 평가 점수 복원
            if (data.assessmentScores) {
                Object.entries(data.assessmentScores).forEach(([id, value]) => {
                    const slider = document.getElementById(id);
                    if (slider) {
                        slider.value = value;
                        this.updateSliderDisplay(slider);
                    }
                });
            }
        }
    }

    getChecklistStates() {
        const states = {};
        document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.id) {
                states[checkbox.id] = checkbox.checked;
            }
        });
        return states;
    }

    getAssessmentScores() {
        const scores = {};
        document.querySelectorAll('.assessment-slider').forEach(slider => {
            if (slider.id) {
                scores[slider.id] = parseInt(slider.value);
            }
        });
        return scores;
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new HolySpiritCompanionApp();
});

// 서비스 워커 등록 (PWA 지원)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}