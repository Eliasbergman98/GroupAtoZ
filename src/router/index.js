import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import PlayerJoinView from '../views/PlayerJoinView.vue'
import PlayerNameView from '../views/PlayerNameView.vue'
import CreateView from '../views/CreateView.vue'
import CreateQuestionsView from '../views/CreateQuestionsView.vue'
import HowToPlayView from '../views/HowToPlayView.vue'
import CreatorWaitingView from '../views/CreatorWaitingView.vue'
import StartingQuizCreatorView from '../views/StartingQuizCreatorView.vue'
import ClueView from '../views/ClueView.vue'
import AfterClueView from '../views/AfterClueView.vue'
import PlayerWaitingView from '../views/PlayerWaitingView.vue'
import StartingQuizPlayerView from '../views/StartingQuizPlayerView.vue'
import LastResultView from '../views/LastResultView.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
    {
      path: '/playerjoin/',
      name: 'PlayerJoinView',
      component: PlayerJoinView
    },
    {
      path: '/playername/:pollId',
      name: 'PlayerNameView',
      component: PlayerNameView
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: CreateView
    },
    {
      path: '/createquestions/:pollId',
      name: 'CreateQuestionsView',
      component: CreateQuestionsView
    },
    {
      path: '/howtoplay/',
      name: 'HowToPlayView',
      component: HowToPlayView
    },
    {
      path: '/creatorwaiting/:pollId',
      name: 'CreatorWaitingView',
      component: CreatorWaitingView
    },
    {
      path: '/startingquizcreator/:pollId/:yourName',
      name: 'StartingQuizCreatorView',
      component: StartingQuizCreatorView
    },
    {
      path: '/clue/:pollId/:yourName',
      name: 'ClueView',
      component: ClueView
    },
    {
      path: '/afterclue/:pollId/:yourName',
      name: 'AfterClueView',
      component: AfterClueView
    },
    {
      path: '/playerwaiting/:pollId',
      name: 'PlayerWaitingView',
      component: PlayerWaitingView
    },
    {
      path: '/startingquizplayer/:pollId/:yourName',
      name: 'StartingQuizPlayerView',
      component: StartingQuizPlayerView
    },
    {
      path: '/lastresult/:pollId',
      name: 'LastResultView',
      component: LastResultView
    },

  ]
})

export default router
