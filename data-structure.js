// 성령과 동행하는 삶 - 개선된 데이터 구조 및 CRUD 시스템

class HolySpiritDataManager {
    constructor() {
        this.DATA_KEY = 'holy-spirit-companion-v2';
        this.initializeDataStructure();
    }

    // 4단계별 체크리스트 정의 (가중치 포함)
    getStageChecklists() {
        return {
            0: { // 1단계: 성령 인식
                title: "성령 인식",
                items: [
                    { id: "recognize_presence", text: "성령님의 존재를 인식하고 인정했나요?", weight: 2.0, priority: "critical" },
                    { id: "pray_to_spirit", text: "성령님께 직접 기도했나요?", weight: 1.5, priority: "high" },
                    { id: "read_about_spirit", text: "성령에 관한 말씀을 읽었나요?", weight: 1.2, priority: "medium" },
                    { id: "acknowledge_help", text: "성령님의 도우심이 필요함을 인정했나요?", weight: 1.8, priority: "high" },
                    { id: "invite_spirit", text: "성령님을 내 마음에 초대했나요?", weight: 1.7, priority: "high" }
                ]
            },
            1: { // 2단계: 성령 순종
                title: "성령 순종",
                items: [
                    { id: "listen_voice", text: "성령님의 음성을 듣기 위해 조용한 시간을 가졌나요?", weight: 1.6, priority: "high" },
                    { id: "obey_conviction", text: "성령님의 지적에 즉시 순종했나요?", weight: 2.0, priority: "critical" },
                    { id: "repent_quickly", text: "죄를 깨달았을 때 즉시 회개했나요?", weight: 1.8, priority: "high" },
                    { id: "resist_temptation", text: "유혹을 받을 때 성령님의 도움을 구했나요?", weight: 1.7, priority: "high" },
                    { id: "choose_righteousness", text: "선택의 순간에 의로운 길을 택했나요?", weight: 1.4, priority: "medium" }
                ]
            },
            2: { // 3단계: 성령 동행
                title: "성령 동행",
                items: [
                    { id: "fellowship_spirit", text: "성령님과 깊은 교제의 시간을 가졌나요?", weight: 1.9, priority: "critical" },
                    { id: "seek_guidance", text: "중요한 결정 전에 성령님의 인도를 구했나요?", weight: 1.8, priority: "high" },
                    { id: "walk_in_spirit", text: "하루 종일 성령님과 동행한다고 의식했나요?", weight: 2.0, priority: "critical" },
                    { id: "yield_to_spirit", text: "내 뜻보다 성령님의 뜻을 우선했나요?", weight: 1.7, priority: "high" },
                    { id: "experience_peace", text: "성령님 안에서 평안을 경험했나요?", weight: 1.3, priority: "medium" }
                ]
            },
            3: { // 4단계: 성령 사역
                title: "성령 사역",
                items: [
                    { id: "minister_in_power", text: "성령님의 능력으로 다른 사람을 섬겼나요?", weight: 1.8, priority: "high" },
                    { id: "share_gospel", text: "복음을 전할 기회를 만들거나 활용했나요?", weight: 2.0, priority: "critical" },
                    { id: "pray_for_others", text: "다른 사람을 위해 성령님의 역사를 구했나요?", weight: 1.6, priority: "high" },
                    { id: "demonstrate_fruits", text: "성령의 열매를 통해 하나님의 사랑을 보여줬나요?", weight: 1.5, priority: "medium" },
                    { id: "encourage_others", text: "성령님의 위로로 다른 사람을 격려했나요?", weight: 1.4, priority: "medium" }
                ]
            }
        };
    }

    // 평가 질문 정의 (각 영역 5문항씩)
    getAssessmentQuestions() {
        return {
            relationship: [
                "성령님과의 기도가 자연스럽고 친밀합니까?",
                "성령님의 음성을 분별할 수 있습니까?",
                "성령님의 임재를 일상에서 느낍니까?",
                "성령님께 의존하는 마음이 큽니까?",
                "성령님과의 교제가 기쁩니까?"
            ],
            character: [
                "사랑의 마음이 풍성합니까?",
                "기쁨이 환경에 좌우되지 않습니까?",
                "평강이 마음에 있습니까?",
                "오래 참는 마음이 있습니까?",
                "온유하고 겸손한 마음입니까?"
            ],
            discernment: [
                "성경의 진리를 분별할 수 있습니까?",
                "선악을 구별하는 지혜가 있습니까?",
                "하나님의 뜻을 분별할 수 있습니까?",
                "거짓 가르침을 식별할 수 있습니까?",
                "영적인 것들을 깨달을 수 있습니까?"
            ],
            ministry: [
                "다른 사람을 섬기는 마음이 있습니까?",
                "복음 전파에 대한 부담이 있습니까?",
                "성령의 은사를 활용하고 있습니까?",
                "교회와 공동체에서 섬기고 있습니까?",
                "성령의 능력으로 사역하고 있습니까?"
            ]
        };
    }

    // 데이터 구조 초기화
    initializeDataStructure() {
        const existingData = this.loadData();
        if (!existingData || !existingData.version || existingData.version < 2) {
            const defaultData = {
                version: 2,
                userProfile: {
                    name: "",
                    startDate: new Date().toISOString().split('T')[0],
                    currentStage: 0
                },
                dailyData: {},
                monthlyStats: {},
                settings: {
                    autoReset: true,
                    notifications: true,
                    theme: "light"
                }
            };
            this.saveData(defaultData);
        }
    }

    // 오늘 날짜 가져오기
    getTodayString() {
        return new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '').replace(/\s/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }

    // 오늘 데이터 가져오기 (없으면 생성)
    getTodayData() {
        const today = this.getTodayString();
        const data = this.loadData();

        if (!data.dailyData[today]) {
            const userStage = data.userProfile.currentStage;
            data.dailyData[today] = {
                date: today,
                stage: userStage,
                checklist: this.getEmptyChecklist(userStage),
                assessment: {
                    relationship: [5, 5, 5, 5, 5],
                    character: [5, 5, 5, 5, 5],
                    discernment: [5, 5, 5, 5, 5],
                    ministry: [5, 5, 5, 5, 5]
                },
                totalScore: 100,
                notes: "",
                completed: false,
                timestamp: new Date().toISOString()
            };
            this.saveData(data);
        }

        return data.dailyData[today];
    }

    // 빈 체크리스트 생성
    getEmptyChecklist(stage) {
        const stageItems = this.getStageChecklists()[stage].items;
        const checklist = {};
        stageItems.forEach(item => {
            checklist[item.id] = false;
        });
        return checklist;
    }

    // 데이터 저장
    saveData(data) {
        try {
            localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('데이터 저장 실패:', error);
            return false;
        }
    }

    // 데이터 로드
    loadData() {
        try {
            const data = localStorage.getItem(this.DATA_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            return null;
        }
    }

    // CRUD 함수들

    // 체크리스트 업데이트
    updateChecklist(itemId, checked) {
        const data = this.loadData();
        const today = this.getTodayString();

        if (!data.dailyData[today]) {
            this.getTodayData(); // 오늘 데이터 생성
        }

        data.dailyData[today].checklist[itemId] = checked;
        data.dailyData[today].timestamp = new Date().toISOString();

        this.saveData(data);
        this.updateDailyProgress(today);
    }

    // 평가 점수 업데이트
    updateAssessment(category, questionIndex, score) {
        const data = this.loadData();
        const today = this.getTodayString();

        if (!data.dailyData[today]) {
            this.getTodayData();
        }

        data.dailyData[today].assessment[category][questionIndex] = parseInt(score);
        data.dailyData[today].timestamp = new Date().toISOString();

        // 총점 계산
        this.calculateTotalScore(today);
        this.saveData(data);
    }

    // 총점 계산 및 검증
    calculateTotalScore(dateString) {
        const data = this.loadData();
        const dayData = data.dailyData[dateString];

        // 카테고리별 점수 검증 및 계산
        const categories = ['relationship', 'character', 'discernment', 'ministry'];
        let total = 0;
        let categoryDetails = {};

        categories.forEach(category => {
            const scores = dayData.assessment[category];

            // 각 카테고리는 5문항이어야 함
            if (scores.length !== 5) {
                console.warn(`${category} 카테고리 문항 수 오류: ${scores.length}개 (5개여야 함)`);
                // 부족한 문항은 기본값 5점으로 채움
                while (scores.length < 5) {
                    scores.push(5);
                }
                // 초과 문항은 제거
                scores.splice(5);
            }

            // 각 점수는 1-10점 범위여야 함
            const validatedScores = scores.map(score => {
                const numScore = parseInt(score);
                if (isNaN(numScore) || numScore < 1 || numScore > 10) {
                    console.warn(`잘못된 점수: ${score} -> 5점으로 조정`);
                    return 5;
                }
                return numScore;
            });

            dayData.assessment[category] = validatedScores;
            const categoryTotal = validatedScores.reduce((sum, score) => sum + score, 0);
            categoryDetails[category] = {
                scores: validatedScores,
                total: categoryTotal,
                average: Math.round((categoryTotal / 5) * 10) / 10
            };
            total += categoryTotal;
        });

        // 총점 검증 (200점 만점)
        if (total < 20 || total > 200) {
            console.warn(`총점 범위 오류: ${total}점 (20-200점 범위여야 함)`);
            total = Math.max(20, Math.min(200, total));
        }

        dayData.totalScore = total;
        dayData.categoryDetails = categoryDetails;

        // 동적 단계 진급 기준 계산
        const newStage = this.calculateOptimalStage(total, dateString);
        dayData.stage = newStage;

        // 사용자 현재 단계도 업데이트
        data.userProfile.currentStage = newStage;

        return total;
    }

    // 동적 단계 진급 기준 계산
    calculateOptimalStage(totalScore, dateString) {
        const data = this.loadData();
        const dayData = data.dailyData[dateString];

        // 체크리스트 완료율 계산
        const checkedItems = Object.values(dayData.checklist).filter(checked => checked).length;
        const totalItems = Object.keys(dayData.checklist).length;
        const checklistRate = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

        // 평가 점수 백분율 (200점 만점 기준)
        const scoreRate = (totalScore / 200) * 100;

        // 카테고리별 균형도 확인 (최고점과 최저점의 차이)
        const categories = ['relationship', 'character', 'discernment', 'ministry'];
        const categoryAverages = categories.map(category => {
            const scores = dayData.assessment[category] || [5, 5, 5, 5, 5];
            return scores.reduce((sum, score) => sum + score, 0) / 5;
        });

        const maxAvg = Math.max(...categoryAverages);
        const minAvg = Math.min(...categoryAverages);
        const balanceScore = 100 - ((maxAvg - minAvg) / maxAvg * 100); // 균형도 (0-100%)

        // 종합 판단 점수 계산 (가중평균)
        const compositeScore = (scoreRate * 0.5) + (checklistRate * 0.3) + (balanceScore * 0.2);

        // 동적 기준선 계산 (과거 데이터 기반 적응적 기준)
        const adaptiveThresholds = this.getAdaptiveThresholds(dateString);

        // 단계 결정
        if (compositeScore >= adaptiveThresholds.ministry &&
            scoreRate >= 70 && checklistRate >= 80) {
            return 3; // 성령 사역
        } else if (compositeScore >= adaptiveThresholds.companionship &&
                   scoreRate >= 60 && checklistRate >= 70) {
            return 2; // 성령 동행
        } else if (compositeScore >= adaptiveThresholds.obedience &&
                   scoreRate >= 50 && checklistRate >= 60) {
            return 1; // 성령 순종
        } else {
            return 0; // 성령 인식
        }
    }

    // 적응적 기준선 계산 (과거 30일 데이터 기반)
    getAdaptiveThresholds(currentDate) {
        const data = this.loadData();
        const pastDays = this.getPastDaysData(currentDate, 30);

        // 기본 기준선 (초기값)
        let defaultThresholds = {
            obedience: 45,    // 성령 순종 (기존 40% → 45%)
            companionship: 65, // 성령 동행 (기존 60% → 65%)
            ministry: 80      // 성령 사역 (기존 80% 유지)
        };

        if (pastDays.length < 7) {
            return defaultThresholds; // 데이터 부족시 기본값 사용
        }

        // 과거 성과 분석
        const pastScores = pastDays.map(day => ({
            composite: this.calculateCompositeScore(day),
            stage: day.stage
        }));

        // 단계별 최소 성과 기준 계산
        const stagePerformance = [[], [], [], []]; // 각 단계별 성과 수집
        pastScores.forEach(score => {
            if (score.stage >= 0 && score.stage <= 3) {
                stagePerformance[score.stage].push(score.composite);
            }
        });

        // 적응적 기준선 조정
        if (stagePerformance[1].length > 0) { // 순종 단계 데이터 있음
            const avgObedience = stagePerformance[1].reduce((a, b) => a + b, 0) / stagePerformance[1].length;
            defaultThresholds.obedience = Math.max(40, Math.min(55, avgObedience * 0.9));
        }

        if (stagePerformance[2].length > 0) { // 동행 단계 데이터 있음
            const avgCompanionship = stagePerformance[2].reduce((a, b) => a + b, 0) / stagePerformance[2].length;
            defaultThresholds.companionship = Math.max(55, Math.min(75, avgCompanionship * 0.9));
        }

        if (stagePerformance[3].length > 0) { // 사역 단계 데이터 있음
            const avgMinistry = stagePerformance[3].reduce((a, b) => a + b, 0) / stagePerformance[3].length;
            defaultThresholds.ministry = Math.max(70, Math.min(85, avgMinistry * 0.9));
        }

        return defaultThresholds;
    }

    // 과거 N일 데이터 가져오기
    getPastDaysData(currentDate, days) {
        const data = this.loadData();
        const currentTime = new Date(currentDate).getTime();
        const pastDates = [];

        for (let i = 1; i <= days; i++) {
            const pastDate = new Date(currentTime - (i * 24 * 60 * 60 * 1000));
            const dateString = pastDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\./g, '').replace(/\s/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

            if (data.dailyData[dateString]) {
                pastDates.push(data.dailyData[dateString]);
            }
        }

        return pastDates;
    }

    // 가중치 적용 체크리스트 점수 계산
    calculateWeightedChecklistScore(dayData) {
        const stageItems = this.getStageChecklists()[dayData.stage].items;
        let totalWeight = 0;
        let achievedWeight = 0;

        stageItems.forEach(item => {
            totalWeight += item.weight;
            if (dayData.checklist[item.id]) {
                achievedWeight += item.weight;
            }
        });

        return totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 0;
    }

    // 우선순위별 체크리스트 분석
    getChecklistPriorityAnalysis(dayData) {
        const stageItems = this.getStageChecklists()[dayData.stage].items;
        const priorities = { critical: 0, high: 0, medium: 0 };
        const completed = { critical: 0, high: 0, medium: 0 };

        stageItems.forEach(item => {
            priorities[item.priority]++;
            if (dayData.checklist[item.id]) {
                completed[item.priority]++;
            }
        });

        return {
            critical: priorities.critical > 0 ? (completed.critical / priorities.critical) * 100 : 0,
            high: priorities.high > 0 ? (completed.high / priorities.high) * 100 : 0,
            medium: priorities.medium > 0 ? (completed.medium / priorities.medium) * 100 : 0,
            overall: this.calculateWeightedChecklistScore(dayData)
        };
    }

    // 종합 점수 계산 헬퍼 함수 (가중치 반영)
    calculateCompositeScore(dayData) {
        const weightedChecklistRate = this.calculateWeightedChecklistScore(dayData);
        const scoreRate = (dayData.totalScore / 200) * 100;

        // 카테고리별 균형도
        const categories = ['relationship', 'character', 'discernment', 'ministry'];
        const categoryAverages = categories.map(category => {
            const scores = dayData.assessment[category] || [5, 5, 5, 5, 5];
            return scores.reduce((sum, score) => sum + score, 0) / 5;
        });

        const maxAvg = Math.max(...categoryAverages);
        const minAvg = Math.min(...categoryAverages);
        const balanceScore = 100 - ((maxAvg - minAvg) / maxAvg * 100);

        // 우선순위 가중치 (critical 항목 완료도가 높을수록 보너스)
        const priorityAnalysis = this.getChecklistPriorityAnalysis(dayData);
        const priorityBonus = (priorityAnalysis.critical * 0.4) + (priorityAnalysis.high * 0.3) + (priorityAnalysis.medium * 0.1);

        // 최종 종합 점수 (가중치 반영)
        return (scoreRate * 0.4) + (weightedChecklistRate * 0.35) + (balanceScore * 0.15) + (priorityBonus * 0.1);
    }

    // 단계 진급 세부 정보 제공
    getStageProgressInfo(dateString) {
        const data = this.loadData();
        const dayData = data.dailyData[dateString];

        if (!dayData) return null;

        const totalScore = dayData.totalScore;
        const checkedItems = Object.values(dayData.checklist).filter(checked => checked).length;
        const totalItems = Object.keys(dayData.checklist).length;
        const checklistRate = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;
        const scoreRate = (totalScore / 200) * 100;

        const compositeScore = this.calculateCompositeScore(dayData);
        const adaptiveThresholds = this.getAdaptiveThresholds(dateString);
        const currentStage = dayData.stage;

        // 다음 단계 진급 조건
        let nextStageInfo = null;
        if (currentStage < 3) {
            const nextStage = currentStage + 1;
            const stageNames = ['성령 인식', '성령 순종', '성령 동행', '성령 사역'];
            const requiredScores = [0, 50, 60, 70]; // 점수율 기준
            const requiredChecklists = [0, 60, 70, 80]; // 체크리스트 기준
            const requiredComposite = [0, adaptiveThresholds.obedience, adaptiveThresholds.companionship, adaptiveThresholds.ministry];

            nextStageInfo = {
                stageName: stageNames[nextStage],
                requirements: {
                    compositeScore: requiredComposite[nextStage],
                    scoreRate: requiredScores[nextStage],
                    checklistRate: requiredChecklists[nextStage]
                },
                currentProgress: {
                    compositeScore: Math.round(compositeScore),
                    scoreRate: Math.round(scoreRate),
                    checklistRate: Math.round(checklistRate)
                },
                gaps: {
                    compositeScore: Math.max(0, requiredComposite[nextStage] - compositeScore),
                    scoreRate: Math.max(0, requiredScores[nextStage] - scoreRate),
                    checklistRate: Math.max(0, requiredChecklists[nextStage] - checklistRate)
                }
            };
        }

        return {
            currentStage: currentStage,
            stageName: ['성령 인식', '성령 순종', '성령 동행', '성령 사역'][currentStage],
            scores: {
                total: totalScore,
                composite: Math.round(compositeScore),
                scoreRate: Math.round(scoreRate),
                checklistRate: Math.round(checklistRate)
            },
            thresholds: adaptiveThresholds,
            nextStage: nextStageInfo
        };
    }

    // 카테고리별 점수 가져오기
    getCategoryScore(dateString, category) {
        const data = this.loadData();
        const dayData = data.dailyData[dateString];

        if (dayData && dayData.categoryDetails && dayData.categoryDetails[category]) {
            return dayData.categoryDetails[category];
        }

        // 실시간 계산
        const scores = dayData.assessment[category] || [5, 5, 5, 5, 5];
        const total = scores.reduce((sum, score) => sum + score, 0);
        return {
            scores: scores,
            total: total,
            average: Math.round((total / 5) * 10) / 10
        };
    }

    // 일일 진행률 업데이트 (가중치 반영)
    updateDailyProgress(dateString) {
        const data = this.loadData();
        const dayData = data.dailyData[dateString];

        // 가중치 적용 체크리스트 완료율 계산
        const weightedChecklistProgress = this.calculateWeightedChecklistScore(dayData);
        const priorityAnalysis = this.getChecklistPriorityAnalysis(dayData);

        // 평가 완료 여부 (기본값 5점이 아닌 것들)
        const assessmentCompleted = Object.values(dayData.assessment).some(scores =>
            scores.some(score => score !== 5)
        );

        // 종합 진행률 (가중치 반영)
        const compositeScore = this.calculateCompositeScore(dayData);

        // 완료 기준: 가중치 진행률 75% 이상 + critical 항목 50% 이상 + 평가 완료
        const criticalRequirement = priorityAnalysis.critical >= 50;
        const progressRequirement = weightedChecklistProgress >= 75;

        dayData.completed = progressRequirement && criticalRequirement && assessmentCompleted;
        dayData.progress = weightedChecklistProgress;
        dayData.priorityProgress = priorityAnalysis;
        dayData.compositeScore = Math.round(compositeScore);

        this.saveData(data);
        this.updateMonthlyStats(dateString);
    }

    // 월별 통계 업데이트
    updateMonthlyStats(dateString) {
        const data = this.loadData();
        const [year, month] = dateString.split('-');
        const monthKey = `${year}-${month}`;

        // 해당 월의 모든 데이터 가져오기
        const monthDays = Object.keys(data.dailyData).filter(date => date.startsWith(monthKey));

        if (monthDays.length === 0) return;

        const monthData = monthDays.map(date => data.dailyData[date]);
        const completedDays = monthData.filter(day => day.completed).length;
        const averageScore = monthData.reduce((sum, day) => sum + day.totalScore, 0) / monthData.length;

        // 단계별 분포
        const stageDistribution = [0, 0, 0, 0];
        monthData.forEach(day => {
            stageDistribution[day.stage]++;
        });

        data.monthlyStats[monthKey] = {
            totalDays: monthData.length,
            completedDays: completedDays,
            averageScore: Math.round(averageScore),
            stageDistribution: stageDistribution,
            lastUpdated: new Date().toISOString()
        };

        this.saveData(data);
    }

    // 특정 날짜 데이터 가져오기
    getDayData(dateString) {
        const data = this.loadData();
        return data.dailyData[dateString] || null;
    }

    // 월간 데이터 가져오기
    getMonthData(year, month) {
        const data = this.loadData();
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        return Object.keys(data.dailyData)
            .filter(date => date.startsWith(monthKey))
            .reduce((monthData, date) => {
                monthData[date] = data.dailyData[date];
                return monthData;
            }, {});
    }

    // 데이터 삭제
    deleteDayData(dateString) {
        const data = this.loadData();
        if (data.dailyData[dateString]) {
            delete data.dailyData[dateString];
            this.saveData(data);

            // 월별 통계 재계산
            this.updateMonthlyStats(dateString);
            return true;
        }
        return false;
    }

    // 전체 데이터 초기화
    resetAllData() {
        if (confirm('모든 데이터가 삭제됩니다. 정말 초기화하시겠습니까?')) {
            localStorage.removeItem(this.DATA_KEY);
            this.initializeDataStructure();
            return true;
        }
        return false;
    }

    // 데이터 내보내기
    exportData() {
        const data = this.loadData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `holy-spirit-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 데이터 가져오기
    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);
            if (importedData.version && importedData.userProfile && importedData.dailyData) {
                this.saveData(importedData);
                return true;
            }
            throw new Error('올바르지 않은 데이터 형식입니다.');
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
            alert('데이터 가져오기에 실패했습니다: ' + error.message);
            return false;
        }
    }

    // 체크리스트 항목 우선순위 정보 가져오기
    getChecklistItemInfo(stage, itemId) {
        const stageData = this.getStageChecklists()[stage];
        const item = stageData.items.find(item => item.id === itemId);
        return item || null;
    }

    // 오늘의 상세 분석 정보
    getTodayDetailedAnalysis() {
        const today = this.getTodayString();
        const dayData = this.getTodayData();

        return {
            basicInfo: {
                date: today,
                stage: dayData.stage,
                stageName: ['성령 인식', '성령 순종', '성령 동행', '성령 사역'][dayData.stage],
                totalScore: dayData.totalScore
            },
            checklistAnalysis: {
                weighted: this.calculateWeightedChecklistScore(dayData),
                priority: this.getChecklistPriorityAnalysis(dayData),
                items: this.getStageChecklists()[dayData.stage].items.map(item => ({
                    ...item,
                    completed: dayData.checklist[item.id] || false
                }))
            },
            progressInfo: this.getStageProgressInfo(today),
            compositeScore: this.calculateCompositeScore(dayData)
        };
    }
}

// 전역에서 사용할 수 있도록 내보내기
window.HolySpiritDataManager = HolySpiritDataManager;