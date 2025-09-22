// 성령과 동행하는 삶 - 개선된 JavaScript with CRUD System

class HolySpiritCompanionApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.stages = ['인식', '순종', '동행', '사역'];
        this.dataManager = new HolySpiritDataManager();
        this.maxScore = 200;

        // 데이터 매니저에서 현재 상태 가져오기
        const todayData = this.dataManager.getTodayData();
        const userData = this.dataManager.loadData().userProfile;

        this.currentStage = userData.currentStage;
        this.totalScore = todayData.totalScore;

        // 달력 매니저 초기화
        this.calendarManager = null;

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.checkDailyReset(); // 일일 초기화 확인
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
        } else if (tabName === 'calendar') {
            this.initializeCalendar();
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
        const itemId = checkbox.id;
        const isChecked = checkbox.checked;

        // 데이터 매니저를 통해 체크리스트 업데이트
        this.dataManager.updateChecklist(itemId, isChecked);

        // UI 업데이트
        const listItem = checkbox.closest('.checklist-item');
        if (listItem) {
            listItem.classList.toggle('completed', isChecked);
        }

        // 진행률 업데이트
        this.updateProgressStats();
    }

    updateRatingDisplay(slider) {
        const value = parseInt(slider.value);
        const ratingValue = slider.parentElement.querySelector('.rating-value');
        if (ratingValue) {
            ratingValue.textContent = `${value}점`;
        }
    }

    calculateTotalScore() {
        // 카테고리별로 점수 수집 및 업데이트
        const categories = ['relationship', 'character', 'discernment', 'ministry'];

        categories.forEach(category => {
            const categorySliders = document.querySelectorAll(`[data-category="${category}"] .rating-slider`);
            categorySliders.forEach((slider, index) => {
                this.dataManager.updateAssessment(category, index, parseInt(slider.value));
            });
        });

        // 데이터 매니저에서 총점 계산 및 단계 업데이트
        const todayData = this.dataManager.getTodayData();
        this.totalScore = todayData.totalScore;
        this.currentStage = todayData.stage;

        this.updateDashboard();
        this.updateAssessmentDisplay();
    }

    updateAssessmentDisplay() {
        // 카테고리별 점수 업데이트
        const categories = ['relationship', 'character', 'discernment', 'ministry'];
        const todayString = this.dataManager.getTodayString();

        categories.forEach(category => {
            const categoryCard = document.querySelector(`[data-category="${category}"]`);
            if (categoryCard) {
                // 실시간 카테고리 점수 계산
                const categoryScore = this.dataManager.getCategoryScore(todayString, category);

                const categoryScoreElement = categoryCard.querySelector('.category-score');
                if (categoryScoreElement) {
                    categoryScoreElement.textContent = `${categoryScore.total}/50`;
                }

                // 카테고리별 평균 표시 (있다면)
                const categoryAvgElement = categoryCard.querySelector('.category-average');
                if (categoryAvgElement) {
                    categoryAvgElement.textContent = `평균: ${categoryScore.average}점`;
                }

                // 진행률 바 업데이트 (있다면)
                const progressBar = categoryCard.querySelector('.category-progress');
                if (progressBar) {
                    const progressPercentage = (categoryScore.total / 50) * 100;
                    progressBar.style.width = `${progressPercentage}%`;
                }
            }
        });

        // 총점 업데이트
        const totalScoreElement = document.querySelector('.total-assessment-score');
        if (totalScoreElement) {
            totalScoreElement.textContent = `${this.totalScore}/200`;
        }

        // 전체 평균 및 통계 (있다면)
        const overallAvgElement = document.querySelector('.overall-average');
        if (overallAvgElement) {
            const overallAverage = Math.round((this.totalScore / 20) * 10) / 10;
            overallAvgElement.textContent = `전체 평균: ${overallAverage}점`;
        }

        // 퍼센트 표시 (있다면)
        const percentageElement = document.querySelector('.score-percentage');
        if (percentageElement) {
            const percentage = Math.round((this.totalScore / 200) * 100);
            percentageElement.textContent = `${percentage}%`;
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
        // 데이터 매니저가 자동으로 저장하므로 별도 저장 불필요
        // 호환성을 위해 함수 유지
    }

    // 새로운 진행률 통계 업데이트 함수 (가중치 반영)
    updateProgressStats() {
        const todayData = this.dataManager.getTodayData();
        const detailedAnalysis = this.dataManager.getTodayDetailedAnalysis();

        // 가중치 적용 체크리스트 진행률
        const weightedProgress = detailedAnalysis.checklistAnalysis.weighted;
        const priorityProgress = detailedAnalysis.checklistAnalysis.priority;

        // 기본 통계 업데이트
        this.updateStatElement('completion-rate', `${Math.round(weightedProgress)}%`);
        this.updateStatElement('current-stage-stat', this.currentStage + 1);
        this.updateStatElement('total-score-stat', this.totalScore);
        this.updateStatElement('journey-days', this.calculateJourneyDays());

        // 종합 점수 표시
        this.updateStatElement('composite-score', Math.round(detailedAnalysis.compositeScore));

        // 우선순위별 진행률 표시
        this.updateStatElement('critical-progress', `${Math.round(priorityProgress.critical)}%`);
        this.updateStatElement('high-progress', `${Math.round(priorityProgress.high)}%`);
        this.updateStatElement('medium-progress', `${Math.round(priorityProgress.medium)}%`);

        // 진행률 바 업데이트 (가중치 반영)
        const progressBar = document.getElementById('stage-progress');
        if (progressBar) {
            progressBar.style.width = `${weightedProgress}%`;
        }

        // 단계별 진행률 바 업데이트
        const criticalBar = document.getElementById('critical-progress-bar');
        const highBar = document.getElementById('high-progress-bar');
        const mediumBar = document.getElementById('medium-progress-bar');

        if (criticalBar) criticalBar.style.width = `${priorityProgress.critical}%`;
        if (highBar) highBar.style.width = `${priorityProgress.high}%`;
        if (mediumBar) mediumBar.style.width = `${priorityProgress.medium}%`;

        // 체크리스트 항목에 가중치 표시 업데이트
        this.updateChecklistWeightDisplay();
    }

    // 체크리스트 항목에 가중치 및 우선순위 표시
    updateChecklistWeightDisplay() {
        const stageItems = this.dataManager.getStageChecklists()[this.currentStage].items;

        stageItems.forEach(item => {
            const checklistElement = document.getElementById(item.id);
            if (checklistElement) {
                const container = checklistElement.closest('.checklist-item');
                if (container) {
                    // 우선순위 클래스 추가
                    container.classList.remove('priority-critical', 'priority-high', 'priority-medium');
                    container.classList.add(`priority-${item.priority}`);

                    // 가중치 표시 요소 추가/업데이트
                    let weightDisplay = container.querySelector('.weight-display');
                    if (!weightDisplay) {
                        weightDisplay = document.createElement('span');
                        weightDisplay.className = 'weight-display';
                        container.appendChild(weightDisplay);
                    }
                    weightDisplay.textContent = `가중치: ${item.weight}`;

                    // 우선순위 배지 추가/업데이트
                    let priorityBadge = container.querySelector('.priority-badge');
                    if (!priorityBadge) {
                        priorityBadge = document.createElement('span');
                        priorityBadge.className = 'priority-badge';
                        container.appendChild(priorityBadge);
                    }

                    const priorityText = {
                        'critical': '🔴 중요',
                        'high': '🟡 높음',
                        'medium': '🟢 보통'
                    };
                    priorityBadge.textContent = priorityText[item.priority];
                }
            }
        });
    }

    loadStoredData() {
        const todayData = this.dataManager.getTodayData();
        const userData = this.dataManager.loadData().userProfile;

        // 현재 상태 복원
        this.currentStage = userData.currentStage;
        this.totalScore = todayData.totalScore;

        // 오늘의 체크리스트 상태 복원
        const stageChecklists = this.dataManager.getStageChecklists();
        const currentStageItems = stageChecklists[this.currentStage].items;

        currentStageItems.forEach(item => {
            const checkbox = document.getElementById(item.id);
            if (checkbox && todayData.checklist[item.id] !== undefined) {
                checkbox.checked = todayData.checklist[item.id];
            }
        });

        // 평가 점수 복원
        const categories = ['relationship', 'character', 'discernment', 'ministry'];
        categories.forEach(category => {
            const categorySliders = document.querySelectorAll(`[data-category="${category}"] .rating-slider`);
            categorySliders.forEach((slider, index) => {
                if (todayData.assessment[category] && todayData.assessment[category][index] !== undefined) {
                    slider.value = todayData.assessment[category][index];
                    this.updateRatingDisplay(slider);
                }
            });
        });

        // UI 업데이트
        this.updateProgressStats();
        this.updateAssessmentDisplay();
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

    initializeCalendar() {
        if (!this.calendarManager) {
            this.calendarManager = new CalendarManager(this.dataManager);
        }
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

    // 일일 초기화 확인 및 처리
    checkDailyReset() {
        const data = this.dataManager.loadData();
        const settings = data.settings;

        // 자동 초기화가 활성화된 경우에만 실행
        if (!settings.autoReset) return;

        const today = this.dataManager.getTodayString();
        const lastResetDate = localStorage.getItem('lastResetDate');

        // 마지막 초기화 날짜와 오늘이 다르면 초기화 실행
        if (lastResetDate !== today) {
            this.performDailyReset();
            localStorage.setItem('lastResetDate', today);
        }
    }

    // 일일 초기화 실행
    performDailyReset() {
        try {
            // 오늘 데이터 초기화 (새로운 데이터 생성)
            const todayData = this.dataManager.getTodayData();

            // 단계별 진급 평가 (어제 데이터 기반)
            this.evaluateStageProgress();

            // 새로운 날 알림
            this.showDailyWelcomeMessage();

            // 진급 안내 표시 (필요시)
            this.showStageProgressInfo();

        } catch (error) {
            console.error('일일 초기화 중 오류:', error);
            this.showNotification('일일 초기화 중 문제가 발생했습니다.', 'error');
        }
    }

    // 단계별 진급 평가
    evaluateStageProgress() {
        const data = this.dataManager.loadData();
        const userProfile = data.userProfile;
        const today = this.dataManager.getTodayString();

        // 과거 7일간의 성과 분석
        const pastWeekData = this.dataManager.getPastDaysData(today, 7);

        if (pastWeekData.length >= 3) { // 최소 3일 데이터 필요
            const avgComposite = pastWeekData.reduce((sum, day) =>
                sum + this.dataManager.calculateCompositeScore(day), 0) / pastWeekData.length;

            const avgScore = pastWeekData.reduce((sum, day) =>
                sum + day.totalScore, 0) / pastWeekData.length;

            const completedDays = pastWeekData.filter(day => day.completed).length;
            const completionRate = (completedDays / pastWeekData.length) * 100;

            // 단계 진급 조건 확인
            const currentStage = userProfile.currentStage;
            const stageNames = ['성령 인식', '성령 순종', '성령 동행', '성령 사역'];

            let shouldPromote = false;
            let promoteMessage = '';

            if (currentStage < 3) {
                const thresholds = this.dataManager.getAdaptiveThresholds(today);

                if (currentStage === 0 && avgComposite >= thresholds.obedience && completionRate >= 70) {
                    shouldPromote = true;
                    promoteMessage = `🎉 축하합니다! "${stageNames[1]}" 단계로 진급하셨습니다!`;
                } else if (currentStage === 1 && avgComposite >= thresholds.companionship && completionRate >= 75) {
                    shouldPromote = true;
                    promoteMessage = `🎉 축하합니다! "${stageNames[2]}" 단계로 진급하셨습니다!`;
                } else if (currentStage === 2 && avgComposite >= thresholds.ministry && completionRate >= 80) {
                    shouldPromote = true;
                    promoteMessage = `🎉 축하합니다! "${stageNames[3]}" 단계로 진급하셨습니다!`;
                }
            }

            if (shouldPromote) {
                userProfile.currentStage = Math.min(3, currentStage + 1);
                this.currentStage = userProfile.currentStage;
                this.dataManager.saveData(data);
                this.showNotification(promoteMessage, 'success');
            }
        }
    }

    // 일일 환영 메시지 표시
    showDailyWelcomeMessage() {
        const stageNames = ['성령 인식', '성령 순종', '성령 동행', '성령 사역'];
        const stageName = stageNames[this.currentStage];

        const welcomeMessage = `🌅 새로운 하루가 시작되었습니다! 오늘도 "${stageName}" 단계에서 성령님과 동행하세요.`;

        setTimeout(() => {
            this.showNotification(welcomeMessage, 'info');
        }, 1000);
    }

    // 단계별 진행 정보 표시
    showStageProgressInfo() {
        const today = this.dataManager.getTodayString();
        const progressInfo = this.dataManager.getStageProgressInfo(today);

        if (progressInfo && progressInfo.nextStage) {
            const nextStage = progressInfo.nextStage;
            const gaps = nextStage.gaps;

            let adviceMessage = '';
            if (gaps.compositeScore > 10) {
                adviceMessage = `다음 단계까지 종합점수 ${Math.round(gaps.compositeScore)}점이 더 필요합니다.`;
            } else if (gaps.checklistRate > 10) {
                adviceMessage = `체크리스트 완료율을 ${Math.round(gaps.checklistRate)}% 더 높여보세요.`;
            } else {
                adviceMessage = `${nextStage.stageName} 단계 진급이 가까워졌습니다! 꾸준히 실천해보세요.`;
            }

            setTimeout(() => {
                this.showNotification(adviceMessage, 'info');
            }, 3000);
        }
    }

    // 수동 초기화 실행 (버튼 클릭 시)
    manualReset() {
        if (confirm('오늘의 데이터를 초기화하시겠습니까? 현재 입력된 모든 정보가 기본값으로 돌아갑니다.')) {
            try {
                // 오늘 데이터만 삭제하고 새로 생성
                const today = this.dataManager.getTodayString();
                this.dataManager.deleteDayData(today);

                // 새로운 오늘 데이터 생성
                const newTodayData = this.dataManager.getTodayData();

                // UI 전체 새로고침
                this.loadStoredData();
                this.updateDashboard();
                this.updateProgressStats();

                this.showNotification('오늘의 데이터가 초기화되었습니다.', 'success');
            } catch (error) {
                console.error('수동 초기화 중 오류:', error);
                this.showNotification('초기화 중 문제가 발생했습니다.', 'error');
            }
        }
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
        window.app.calculateTotalScore();
        window.app.showNotification('평가 결과가 저장되었습니다.');
    }
}

// CRUD 관련 전역 함수들
function exportData() {
    if (window.app) {
        window.app.dataManager.exportData();
        window.app.showNotification('데이터를 성공적으로 내보냈습니다.');
    }
}

function importData() {
    if (window.app) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const result = window.app.dataManager.importData(e.target.result);
                    if (result) {
                        window.app.showNotification('데이터를 성공적으로 가져왔습니다.');
                        window.location.reload(); // 페이지 새로고침
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

function resetAllData() {
    if (window.app) {
        const result = window.app.dataManager.resetAllData();
        if (result) {
            window.app.showNotification('모든 데이터가 초기화되었습니다.');
            window.location.reload(); // 페이지 새로고침
        }
    }
}

function viewCalendar() {
    if (window.app) {
        window.app.showTab('calendar');
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