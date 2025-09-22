// 성령과 동행하는 삶 - 달력 기능

class CalendarManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentDate = new Date();
        this.currentView = 'month'; // 'month' or 'week'
        this.detailMode = 'minimal'; // 'minimal' or 'detailed'

        this.monthNames = [
            '1월', '2월', '3월', '4월', '5월', '6월',
            '7월', '8월', '9월', '10월', '11월', '12월'
        ];

        this.dayNames = ['일', '월', '화', '수', '목', '금', '토'];

        this.initializeCalendar();
    }

    initializeCalendar() {
        this.setupEventListeners();
        this.updateCalendar();
        this.updateMonthlyStats();
    }

    setupEventListeners() {
        // 보기 토글
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // 상세 토글
        document.querySelectorAll('[data-detail]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchDetailMode(e.target.dataset.detail);
            });
        });

        // 네비게이션
        document.getElementById('prev-period').addEventListener('click', () => {
            this.navigatePeriod(-1);
        });

        document.getElementById('next-period').addEventListener('click', () => {
            this.navigatePeriod(1);
        });

        // 날짜 상세 모달
        document.getElementById('edit-date-btn').addEventListener('click', () => {
            this.editSelectedDate();
        });

        document.getElementById('delete-date-btn').addEventListener('click', () => {
            this.deleteSelectedDate();
        });
    }

    switchView(view) {
        this.currentView = view;

        // 버튼 활성화 상태 변경
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // 보기 변경
        document.querySelectorAll('.calendar-view').forEach(viewEl => {
            viewEl.classList.toggle('active', viewEl.id === `${view}-view`);
        });

        this.updateCalendar();
    }

    switchDetailMode(mode) {
        this.detailMode = mode;

        // 버튼 활성화 상태 변경
        document.querySelectorAll('[data-detail]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.detail === mode);
        });

        this.updateCalendar();
    }

    navigatePeriod(direction) {
        if (this.currentView === 'month') {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        }

        this.updateCalendar();
        this.updateMonthlyStats();
    }

    updateCalendar() {
        this.updatePeriodTitle();

        if (this.currentView === 'month') {
            this.renderMonthView();
        } else {
            this.renderWeekView();
        }
    }

    updatePeriodTitle() {
        const titleElement = document.getElementById('current-period');

        if (this.currentView === 'month') {
            titleElement.textContent = `${this.currentDate.getFullYear()}년 ${this.monthNames[this.currentDate.getMonth()]}`;
        } else {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            titleElement.textContent = `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`;
        }
    }

    renderMonthView() {
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // 월의 첫째 날과 마지막 날
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 첫 주의 시작일 (일요일)
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // 6주간 표시
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);

                const dayElement = this.createDayElement(currentDate, month);
                calendarDays.appendChild(dayElement);
            }
        }
    }

    renderWeekView() {
        const weekGrid = document.getElementById('week-grid');
        weekGrid.innerHTML = '';

        const weekStart = this.getWeekStart(this.currentDate);

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);

            const weekDay = this.createWeekDayElement(currentDate);
            weekGrid.appendChild(weekDay);
        }
    }

    createDayElement(date, currentMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        // 다른 달 날짜 표시
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }

        // 오늘 날짜 표시
        const today = new Date();
        if (this.isSameDate(date, today)) {
            dayElement.classList.add('today');
        }

        // 날짜 데이터 가져오기
        const dateString = this.formatDateString(date);
        const dayData = this.dataManager.getDayData(dateString);

        // 날짜 번호
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayElement.appendChild(dayNumber);

        // 단계 표시
        if (dayData) {
            const stageElement = document.createElement('div');
            stageElement.className = `day-stage stage-${dayData.stage}`;
            dayElement.appendChild(stageElement);

            // 상세 모드일 때 추가 정보
            if (this.detailMode === 'detailed') {
                const detailsElement = document.createElement('div');
                detailsElement.className = 'day-details';

                const completion = this.calculateDayCompletion(dayData);
                detailsElement.innerHTML = `
                    <div class="day-completion">${completion}%</div>
                    <div class="day-score">${dayData.totalScore}점</div>
                `;
                dayElement.appendChild(detailsElement);
            }
        }

        // 클릭 이벤트
        dayElement.addEventListener('click', () => {
            this.showDateDetail(date, dayData);
        });

        return dayElement;
    }

    createWeekDayElement(date) {
        const weekDay = document.createElement('div');
        weekDay.className = 'week-day';

        // 오늘 날짜 표시
        const today = new Date();
        if (this.isSameDate(date, today)) {
            weekDay.classList.add('today');
        }

        // 날짜 데이터 가져오기
        const dateString = this.formatDateString(date);
        const dayData = this.dataManager.getDayData(dateString);

        // 요일 헤더
        const header = document.createElement('div');
        header.className = 'week-day-header';
        header.textContent = this.dayNames[date.getDay()];
        weekDay.appendChild(header);

        // 날짜 번호
        const dayNumber = document.createElement('div');
        dayNumber.className = 'week-day-number';
        dayNumber.textContent = date.getDate();
        weekDay.appendChild(dayNumber);

        // 단계 표시
        if (dayData) {
            const stageElement = document.createElement('div');
            stageElement.className = `week-day-stage stage-${dayData.stage}`;
            weekDay.appendChild(stageElement);

            const completion = this.calculateDayCompletion(dayData);
            const info = document.createElement('div');
            info.className = 'week-day-info';
            info.innerHTML = `${completion}% | ${dayData.totalScore}점`;
            weekDay.appendChild(info);
        } else {
            const emptyStage = document.createElement('div');
            emptyStage.className = 'week-day-stage no-data';
            weekDay.appendChild(emptyStage);

            const info = document.createElement('div');
            info.className = 'week-day-info';
            info.textContent = '데이터 없음';
            weekDay.appendChild(info);
        }

        // 클릭 이벤트
        weekDay.addEventListener('click', () => {
            this.showDateDetail(date, dayData);
        });

        return weekDay;
    }

    showDateDetail(date, dayData) {
        const modal = document.getElementById('dateDetailModal');
        const dateTitle = document.getElementById('modal-date-title');

        // 모달 제목 설정
        dateTitle.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

        if (dayData) {
            // 요약 정보 업데이트
            document.getElementById('modal-stage').textContent = `${dayData.stage + 1}단계: ${this.dataManager.stages[dayData.stage]}`;
            document.getElementById('modal-score').textContent = `${dayData.totalScore}점`;
            document.getElementById('modal-completion').textContent = `${this.calculateDayCompletion(dayData)}%`;

            // 체크리스트 미리보기
            this.renderChecklistPreview(dayData);

            // 버튼 활성화
            document.getElementById('edit-date-btn').style.display = 'flex';
            document.getElementById('delete-date-btn').style.display = 'flex';
        } else {
            // 데이터 없음
            document.getElementById('modal-stage').textContent = '데이터 없음';
            document.getElementById('modal-score').textContent = '0점';
            document.getElementById('modal-completion').textContent = '0%';

            const checklistPreview = document.getElementById('modal-checklist');
            checklistPreview.innerHTML = '<p>이 날짜에는 기록된 데이터가 없습니다.</p>';

            // 버튼 비활성화
            document.getElementById('edit-date-btn').style.display = 'none';
            document.getElementById('delete-date-btn').style.display = 'none';
        }

        // 선택된 날짜 저장
        this.selectedDate = date;

        // 모달 표시
        modal.classList.add('active');
    }

    renderChecklistPreview(dayData) {
        const checklistPreview = document.getElementById('modal-checklist');
        checklistPreview.innerHTML = '<h4>오늘의 실천 체크리스트</h4>';

        const stageChecklists = this.dataManager.getStageChecklists();
        const stageItems = stageChecklists[dayData.stage].items;

        stageItems.forEach(item => {
            const isChecked = dayData.checklist[item.id] || false;
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';

            previewItem.innerHTML = `
                <div class="preview-check ${isChecked ? '' : 'unchecked'}">
                    ${isChecked ? '✓' : ''}
                </div>
                <span>${item.text}</span>
            `;

            checklistPreview.appendChild(previewItem);
        });
    }

    calculateDayCompletion(dayData) {
        const checkedItems = Object.values(dayData.checklist).filter(checked => checked).length;
        const totalItems = Object.keys(dayData.checklist).length;
        return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    }

    editSelectedDate() {
        if (this.selectedDate) {
            // 해당 날짜로 대시보드 이동 및 편집 모드
            const dateString = this.formatDateString(this.selectedDate);

            // 모달 닫기
            document.getElementById('dateDetailModal').classList.remove('active');

            // 대시보드로 이동
            if (window.app) {
                window.app.showTab('dashboard');
                window.app.showNotification(`${dateString} 데이터를 편집할 수 있습니다.`);
            }
        }
    }

    deleteSelectedDate() {
        if (this.selectedDate && confirm('이 날짜의 데이터를 정말 삭제하시겠습니까?')) {
            const dateString = this.formatDateString(this.selectedDate);
            const result = this.dataManager.deleteDayData(dateString);

            if (result) {
                // 모달 닫기
                document.getElementById('dateDetailModal').classList.remove('active');

                // 달력 새로고침
                this.updateCalendar();
                this.updateMonthlyStats();

                if (window.app) {
                    window.app.showNotification('데이터가 삭제되었습니다.');
                }
            }
        }
    }

    updateMonthlyStats() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        const monthData = this.dataManager.getMonthData(year, month.toString().padStart(2, '0'));

        const days = Object.values(monthData);
        const activeDays = days.filter(day => day.completed).length;
        const totalDays = days.length;
        const completionRate = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;
        const avgScore = totalDays > 0 ? Math.round(days.reduce((sum, day) => sum + day.totalScore, 0) / totalDays) : 0;
        const maxStage = totalDays > 0 ? Math.max(...days.map(day => day.stage)) + 1 : 1;

        // 통계 업데이트
        document.getElementById('monthly-active-days').textContent = activeDays;
        document.getElementById('monthly-completion').textContent = completionRate;
        document.getElementById('monthly-avg-score').textContent = avgScore;
        document.getElementById('monthly-max-stage').textContent = maxStage;
    }

    // 유틸리티 함수들
    formatDateString(date) {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '').replace(/\s/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    getWeekStart(date) {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart;
    }
}

// 전역에서 사용할 수 있도록 내보내기
window.CalendarManager = CalendarManager;