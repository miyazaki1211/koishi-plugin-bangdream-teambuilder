import { Server } from './Server';
export declare class Player {
    playerId: number;
    isExist: boolean;
    initError: boolean;
    cache: boolean;
    time: number;
    profile: {
        userId: string;
        userName: string;
        rank: number;
        degree: number;
        introduction: string;
        publishTotalDeckPowerFlg: boolean;
        publishBandRankFlg: boolean;
        publishMusicClearedFlg: boolean;
        publishMusicFullComboFlg: boolean;
        publishHighScoreRatingFlg: boolean;
        publishUserIdFlg: boolean;
        searchableFlg: boolean;
        publishUpdatedAtFlg: boolean;
        friendApplicableFlg: boolean;
        publishMusicAllPerfectFlg: boolean;
        publishDeckRankFlg: boolean;
        publishStageChallengeAchievementConditionsFlg: boolean;
        publishStageChallengeFriendRankingFlg: boolean;
        publishCharacterRankFlg: boolean;
        mainDeckUserSituations: {
            entries: Array<{
                userId: string;
                situationId: number;
                level: number;
                exp: number;
                createdAt: string;
                addExp: number;
                trainingStatus: 'not_doing' | 'done';
                duplicateCount: number;
                illust: 'after_training' | 'normal';
                skillExp: number;
                skillLevel: number;
                userAppendParameter: {
                    userId: string;
                    situationId: number;
                    performance: number;
                    technique: number;
                    visual: number;
                    characterPotentialPerformance: number;
                    characterPotentialTechnique: number;
                    characterPotentialVisual: number;
                };
                limitBreakRank: number;
            }>;
        };
        enabledUserAreaItems: {
            entries: Array<{
                userId: string;
                areaItemId: number;
                areaItemCategory: number;
                level: number;
            }>;
        };
        bandRankMap: {
            entries: {
                [bandId: number]: number;
            };
        };
        userHighScoreRating: {
            [bandHighScoreRatingName: string]: {
                entries: Array<{
                    musicId: number;
                    difficulty: string;
                    rating: number;
                }>;
            };
        };
        mainUserDeck: {
            deckId: number;
            deckName: string;
            leader: number;
            member1: number;
            member2: number;
            member3: number;
            member4: number;
            deckType: string;
        };
        userProfileSituation: {
            userId: string;
            situationId: number;
            illust: 'after_training' | 'normal';
            viewProfileSituationStatus: 'deck_leader' | 'profile_situation';
        };
        userProfileDegreeMap: {
            entries: {
                first: {
                    userId: string;
                    profileDegreeType: string;
                    degreeId: number;
                };
                second: {
                    userId: string;
                    profileDegreeType: string;
                    degreeId: number;
                };
            };
        };
        userTwitter?: {
            twitterId: string;
            twitterName: string;
            screenName: string;
            url: string;
            profileImageUrl: string;
        };
        userDeckTotalRatingMap: {
            entries: {
                [bandId: number]: {
                    rank: string;
                    score: number;
                    level: number;
                    lowerRating: number;
                    upperRating: number;
                };
            };
        };
        stageChallengeAchievementConditionsMap: {
            entries: {
                [bandId: number]: number;
            };
        };
        userMusicClearInfoMap: {
            entries: {
                [difficultyName: string]: {
                    clearedMusicCount: number;
                    fullComboMusicCount: number;
                    allPerfectMusicCount: number;
                };
            };
        };
        userCharacterRankMap: {
            entries: {
                [characterId: number]: {
                    rank: number;
                    exp: number;
                    addExp: number;
                    nextExp: number;
                    totalExp: number;
                    releasedPotentialLevel: number;
                };
            };
        };
        userIllust: {
            cardId: number;
            trainingStatus: boolean;
        };
    };
    server: Server;
    isInitfull: boolean;
    constructor(playerId: number, server: Server);
    initFull(useCache?: boolean, mode?: 0 | 1 | 2 | 3): Promise<void>;
}
