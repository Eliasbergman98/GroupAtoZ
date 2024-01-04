import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import JoinView from '../views/JoinView.vue'
import QuizView from '../views/QuizView.vue'
import CreateView from '../views/CreateView.vue'
import CreateQuestionsView from '../views/CreateQuestionsView.vue'
import HowToPlayView from '../views/HowToPlayView.vue'
import PlayerJoiningView from '../views/PlayerJoiningView.vue'
import StartingQuizView from '../views/StartingQuizView.vue'
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
      path: '/join/',
      name: 'JoinView',
      component: JoinView
    },
    {
      path: '/quiz/:pollId',
      name: 'QuizView',
      component: QuizView
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
      path: '/playerjoining/:pollId',
      name: 'PlayerJoiningView',
      component: PlayerJoiningView
    },
    {
      path: '/startingquiz/:pollId/:yourName',
      name: 'StartingQuizView',
      component: StartingQuizView
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
