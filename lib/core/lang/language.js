"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageMessages = void 0;
exports.LanguageMessages = {
    en: {
        actionBlocked: 'Action Blocked',
        actionBlockedAbortion: 'Aborted operation due to action blocked',
        alreadyFollowingUser: 'We are already following this user',
        alreadyUnfollowUser: 'User has been unfollowed already',
        buttonStateUnchanged: 'Button did not change state',
        dbNoFollowedDatabase: 'No followed database found',
        dbNoLikesDatabase: 'No likes database found',
        dbNoUnfollowedDatabase: 'No unfollowed database found',
        dbSaveFailed: 'Failed to save database',
        deletingCookies: 'Deleting cookies',
        deletingCookiesFailed: 'Failed to delete the cookies',
        followingFailed: (value) => {
            return `Failed to process follower ${value}`;
        },
        followingReachedLimit: 'Have reached followed limit for this user, stopping',
        followingUpTo: (value, username) => {
            return `Following up to ${value} followers of ${username}`;
        },
        followingUser: (value) => {
            return `Following user ${value}`;
        },
        goToUrl: (url) => {
            return `Go to ${url}`;
        },
        hasMorePages: (value) => {
            return `Has more pages (current: ${value})`;
        },
        haveFollowedInTheLastDay: (value) => {
            return `Have followed/unfollowed ${value} in the last 24 hours`;
        },
        haveFollowedInTheLastHour: (value) => {
            return `Have followed/unfollowed ${value} in the last hour`;
        },
        haveLikedImagesInTheLastDay: (value) => {
            return `Have liked ${value} images in the last 24 hours`;
        },
        likeImageCount: (count) => {
            return `Liking ${count} image(s)`;
        },
        likeImageDone: 'Done liking images',
        likeImageFailed: (value) => {
            return `Failed to like user images ${value}`;
        },
        logginPageButtonNotFound: 'Login page button not found, assuming we have login form',
        loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.',
        missingGraphql: 'Missing graphql in page, falling back to alternative method...',
        navigatingToUser: (username) => {
            return `Navigating to user ${username}`;
        },
        noCookiesFound: 'No cookies found',
        noImageToLike: 'No images to like',
        privateUser: 'User is private, skipping',
        reachDailyFollowUnfollowLimit: 'Have reached daily follow/unfollow limit, waiting 10 min',
        reachHourlyFollowLimit: 'Have reached hourly follow rate limit, waiting 10 min',
        savingCookies: 'Saving cookies',
        savingCookiesFailed: 'Failes to save the cookies',
        settingInstagramLanguage: 'Setting language to english',
        stillNotLoggedIn: 'Still not logged in, trying to reload loading page',
        takingScreenshot: 'Taking screenshot',
        takingScreenshotFailed: 'Failed to take screenshot',
        tooManyFollowerFollowing: (followedByCount, followsCount) => {
            return `User has too many or too few followers or following, skipping. followedByCount: ${followedByCount}, followsCount: ${followsCount}`;
        },
        tooManyFollowerRation: 'User has too many followers compared to follows or opposite, skipping',
        tooManyRequests: 'Got 429 Too Many Requests, waiting...',
        unfollowBreak: 'Have unfollowed 10 users since last break. Taking a break',
        unfollowCount: (count) => {
            return `Unfollowing ${count} users`;
        },
        unfollowCounter: (value, total) => {
            return `Have now unfollowed ${value} users of total ${total}`;
        },
        unfollowFailed: 'Failed to unfollow, continuing with next',
        unfollowNonMutual: 'Unfollowing non-mutual followers...',
        unfollowOldAutofollow: (days) => {
            return `Unfollowing currently followed users who were auto-followed more than ${days} days ago...`;
        },
        unfollowReachLimit: (limit) => {
            return `Have unfollowed limit of ${limit}, stopping`;
        },
        unfollowUsers: 'Users to unfollow',
        unfollowingUser: (value) => {
            return `Unfollowing user ${value}`;
        },
        unfollowingUserFailed: 'Failed to find unfollow button',
        userNotFound: 'User not found',
        usernameDetectionFailed: 'Failed to detect username',
        waiting: 'Waiting'
    },
    fr: {
        actionBlocked: 'Action bloquée',
        actionBlockedAbortion: "Abortion de l\'opération car l\'action a été bloquée",
        alreadyFollowingUser: 'Déja abonné à cet utilisateur',
        alreadyUnfollowUser: "Déjà désabonné de l\'utilisateur",
        buttonStateUnchanged: 'L\'état du button n\'a pas changé',
        dbNoFollowedDatabase: 'Pas de base de donnée trouvé pour enregistrer les abonnements',
        dbNoLikesDatabase: "Pas de base de donnée trouvé pour enregistrer les mention \"j'aime\"",
        dbNoUnfollowedDatabase: 'Pas de base de donnée trouvé pour enregistrer les désabonnements',
        dbSaveFailed: 'Enregistrement des données échoué',
        deletingCookies: 'Suppression des cookies',
        deletingCookiesFailed: 'Échec de la suppression des cookies',
        followingFailed: (value) => {
            return `Échec de l'abonnement à l'utilisateur ${value}`;
        },
        followingReachedLimit: "Limite d\'abonnement atteinte pour cet utilisateur, arrêt",
        followingUpTo: (value, username) => {
            return `Aller jusqu\'à ${value} abonnement aux utilisateurs de l\'utilisateur ${username}`;
        },
        followingUser: (value) => {
            return `Abonnement à l\'utilisateur ${value}`;
        },
        goToUrl: (url) => {
            return `Navigation vers ${url}`;
        },
        hasMorePages: (value) => {
            return `Il y a encore des pages (page actuelle: ${value})`;
        },
        haveFollowedInTheLastDay: (value) => {
            return `il y a eu ${value} (dés)abonnements dans les dernière 24 heures`;
        },
        haveFollowedInTheLastHour: (value) => {
            return `il y a eu ${value} (dés)abonnements dans la dernière heure`;
        },
        haveLikedImagesInTheLastDay: (value) => {
            return `Il y a ey ${value} images aimés dans les dernières 24 heures`;
        },
        likeImageCount: (count) => {
            return `Mention "J'aime" ${count} image(s)`;
        },
        likeImageDone: 'Mention \"J\'aime\" sur les images terminé',
        likeImageFailed: (value) => {
            return `Mention "j'aime" sur les images de l'utilisateur ${value} échoué`;
        },
        logginPageButtonNotFound: 'Page de connexion non trouvé, continuer comme si la connexion est établie',
        loginFailed: 'ATTENTION: Connexion échouée. Cela peut être dû à un nom d\'utilisateur ou un mot de passe incorrect. Cela peut aussi être dû à une connexion suspicieuse. Vous devez manuellement compléter ce processus.',
        missingGraphql: 'Graphql manquant sur la page, utilisation de la méthode alternative...',
        navigatingToUser: (username) => {
            return `Navigation vers ${username}`;
        },
        noCookiesFound: 'Aucun cookie n\'a été trouvé',
        noImageToLike: 'Pas d\'image permettant la mention "j\'aime"',
        privateUser: "Le compte de l\'utilisateur est privé, passer",
        reachDailyFollowUnfollowLimit: 'Limite (dés)abonnement atteinte, patienter 10 min',
        reachHourlyFollowLimit: 'Limite d\'abonnement par heure atteinte, patienter 10 min',
        savingCookies: 'Enregistrement des cookies',
        savingCookiesFailed: 'Échec de l\'enregistrement des cookies',
        settingInstagramLanguage: 'Réglage de la langue sur anglais',
        stillNotLoggedIn: 'Toujours pas connecté, nous allons essayer de rafraichir la page',
        takingScreenshot: 'Capture d\'écran',
        takingScreenshotFailed: 'Échec de la capture d\'écran',
        tooManyFollowerFollowing: (followedByCount, followsCount) => {
            return `L'utilisateur a trop d'abonnés ou d'abonnement, passer. Abonnés: ${followedByCount}, Abonnements: ${followsCount}`;
        },
        tooManyFollowerRation: "l'utilisateur a trop d'abonnés comparé aux abonnements ou vice versa, passer",
        tooManyRequests: 'Erreur 429 trop de requêtes, patienter...',
        unfollowBreak: '10 désabonnements réalisés depuis la dernière pause. Pause',
        unfollowCount: (count) => {
            return `Désabonnements de ${count} users`;
        },
        unfollowCounter: (value, total) => {
            return `Désabonnements de ${value} utilisateurs sur ${total}`;
        },
        unfollowFailed: "Désabonnement échoué, désabonnement de l'utilisateur suivant",
        unfollowNonMutual: 'Désabonnement des utilisateurs non mutuel...',
        unfollowOldAutofollow: (days) => {
            return `Désabonnement des utilisateurs pour lesquels un abonnement automatique a été réalisé il y a plus de ${days} jours...`;
        },
        unfollowReachLimit: (limit) => {
            return `limit de désabonnement atteinte ${limit}, arrêt`;
        },
        unfollowUsers: 'Se désabonner des utilisateurs suivants ',
        unfollowingUser: (value) => {
            return `Désabonnement à l\'utilisateur ${value}`;
        },
        unfollowingUserFailed: "Échec de désabonnement à l\'utilisateur",
        userNotFound: 'Utilisateur non trouvé',
        usernameDetectionFailed: 'Échec de la detection du nom d\'utilisateur',
        waiting: 'Patienter'
    }
};
//# sourceMappingURL=language.js.map