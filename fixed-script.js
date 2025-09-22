// 성령과 동행하는 삶 - Fixed JavaScript for HTML Structure

class HolySpiritCompanionApp {
    constructor() {
        this.currentTab = 'dashboard';
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
        this.showTab('dashboard');
        this.updateCurrentDate();
    }

    setupEventListeners() {
        // 탭 네비게이션 (헤더)
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showTab(e.target.dataset.tab || e.target.closest('.nav-btn').dataset.tab);
            });
        });

        // 하단 네비게이션 (모바일)
        document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showTab(e.target.dataset.tab || e.target.closest('.bottom-nav-btn').dataset.tab);
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
        document.querySelectorAll('.rating-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateRatingDisplay(e.target);
            });
            slider.addEventListener('change', (e) => {
                this.calculateTotalScore();
                this.saveData();
            });
        });

        // 모달 관련
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // 모달 배경 클릭으로 닫기
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showTab(tabName) {
        // 헤더 네비게이션 활성화
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // 하단 네비게이션 활성화
        document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // 탭 컨텐츠 표시
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName) {
                content.classList.add('active');
            }
        });

        this.currentTab = tabName;

        // 탭별 초기화
        if (tabName === 'assessment') {
            this.updateAssessmentDisplay();
        }
    }

    updateCurrentDate() {
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            const today = new Date();
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            };
            currentDateElement.textContent = today.toLocaleDateString('ko-KR', options);
        }
    }

    updateDashboard() {
        // 현재 단계 표시
        const stageElement = document.getElementById('current-stage');
        if (stageElement) {
            stageElement.textContent = `${this.currentStage + 1}단계: ${this.stages[this.currentStage]}`;
        }

        const descriptions = [
            '성령의 존재와 역할을 깨닫고 인정하는 단계입니다.',
            '성령의 지적에 즉시 순종하고 회개의 깊이가 증가하는 단계입니다.',
            '성령과 깊은 교제를 나누며 일상에서 지속적인 인도를 받는 단계입니다.',
            '성령의 능력으로 다른 사람들을 섬기고 하나님의 사랑을 전하는 단계입니다.'
        ];

        const descriptionElement = document.getElementById('stage-description');
        if (descriptionElement) {
            descriptionElement.textContent = descriptions[this.currentStage];
        }

        // 진행률 표시
        const progressElement = document.getElementById('stage-progress');
        if (progressElement) {
            const progress = ((this.currentStage + 1) / this.stages.length) * 100;
            progressElement.style.width = `${progress}%`;
        }

        // 체크리스트 통계 업데이트
        this.updateStats();
    }

    updateStats() {
        const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const completedItems = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');

        const completionRate = checklistItems.length > 0 ?
            Math.round((completedItems.length / checklistItems.length) * 100) : 0;

        // 통계 업데이트 (만약 통계 요소들이 있다면)
        this.updateStatElement('completion-rate', `${completionRate}%`);
        this.updateStatElement('current-stage-stat', this.currentStage + 1);
        this.updateStatElement('total-score-stat', this.totalScore);
        this.updateStatElement('journey-days', this.calculateJourneyDays());
    }

    updateStatElement(id, value) {
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
        // CSS의 :has() 선택자가 스타일을 자동으로 처리하므로 여기서는 추가 작업 불필요
    }

    updateRatingDisplay(slider) {
        const value = parseInt(slider.value);
        const ratingValue = slider.parentElement.querySelector('.rating-value');
        if (ratingValue) {
            ratingValue.textContent = `${value}점`;
        }
    }

    calculateTotalScore() {
        const sliders = document.querySelectorAll('.rating-slider');
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

        this.updateDashboard();
    }

    updateAssessmentDisplay() {
        // 카테고리별 점수 업데이트
        const categories = ['relationship', 'character', 'discernment', 'ministry'];

        categories.forEach(category => {
            const categoryCard = document.querySelector(`[data-category="${category}"]`);
            if (categoryCard) {
                const categorySliders = categoryCard.querySelectorAll('.rating-slider');
                let categoryTotal = 0;
                categorySliders.forEach(slider => {
                    categoryTotal += parseInt(slider.value);
                });

                const categoryScore = categoryCard.querySelector('.category-score');
                if (categoryScore) {
                    categoryScore.textContent = `${categoryTotal}/50`;
                }
            }
        });

        // 총점 업데이트
        const totalScoreElement = document.querySelector('.total-assessment-score');
        if (totalScoreElement) {
            totalScoreElement.textContent = `${this.totalScore}/200`;
        }
    }

    openModal(modalId = 'journalModal') {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
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
                    }
                });
            }

            // 평가 점수 복원
            if (data.assessmentScores) {
                Object.entries(data.assessmentScores).forEach(([id, value]) => {
                    const slider = document.getElementById(id);
                    if (slider) {
                        slider.value = value;
                        this.updateRatingDisplay(slider);
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
        document.querySelectorAll('.rating-slider').forEach(slider => {
            if (slider.id) {
                scores[slider.id] = parseInt(slider.value);
            }
        });
        return scores;
    }

    showNotification(message, type = 'success') {
        // 간단한 알림 표시
        const notification = document.createElement('div');
        notification.className = `toast ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--success-color);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 애니메이션으로 표시
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 3초 후 제거
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 전역 함수들 (HTML의 onclick에서 사용)
function openNewEntry() {
    if (window.app) {
        window.app.openModal('journalModal');
    }
}

function closeModal() {
    if (window.app) {
        window.app.closeModal();
    }
}

function saveAssessment() {
    if (window.app) {
        window.app.saveData();
        window.app.showNotification('평가 결과가 저장되었습니다.');
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HolySpiritCompanionApp();
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