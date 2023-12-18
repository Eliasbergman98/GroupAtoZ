import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

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
      component: () => import('../views/JoinView.vue')
    },
    {
      path: '/quiz/:pollId',
      name: 'QuizView',
      component: () => import('../views/QuizView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/createquestions/:pollId',
      name: 'CreateQuestionsView',
      component: () => import('../views/CreateQuestionsView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    },
    {
      path: '/howtoplay/',
      name: 'HowToPlayView',
      component: () => import('../views/HowToPlayView.vue')
    },
    {
      path: '/playerjoining/:pollId',
      name: 'PlayerJoiningView',
      component: () => import('../views/PlayerJoiningView.vue')
    },
    {
      path: '/startingquiz/:pollId/:yourName',
      name: 'StartingQuizView',
      component: () => import('../views/StartingQuizView.vue')
    },
    {
      path: '/clue/:pollId/:yourName',
      name: 'ClueView',
      component: () => import('../views/ClueView.vue')
    },
    {
    path: '/afterclue/:pollId/:yourName',
      name: 'AfterClueView',
      component: () => import('../views/AfterClueView.vue')
    },
    {
      path: '/playerwaiting/:pollId',
      name: 'PlayerWaitingView',
      component: () => import('../views/PlayerWaitingView.vue')
    },
    {
      path: '/startingquizplayer/:pollId/:yourName',
      name: 'StartingQuizPlayerView',
      component: () => import('../views/StartingQuizPlayerView.vue'),
    },
    // {
    //   path: '/startingquizplayer/:pollId/:yourName',  // Add :yourName to the route
    //   name: 'StartingQuizPlayerView',
    //   component: StartingQuizPlayerView,
    //   props: (route) => ({
    //     pollId: route.params.pollId,
    //     yourName: route.params.yourName,
    //   }),
    // },
    
    {
      path: '/lastresult/:pollId',
      name: 'LastResultView',
      component: () => import('../views/LastResultView.vue')
    },
    {
      path: '/afterclueplayer/:pollId',
        name: 'AfterCluePlayerView',
        component: () => import('../views/AfterCluePlayerView.vue')
      },
  ]
})

export default router
