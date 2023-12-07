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
      path: '/quiz/:gamecode',
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
      path: '/playerjoining/',
      name: 'PlayerJoiningView',
      component: () => import('../views/PlayerJoiningView.vue')
    },
    {
      path: '/startingquiz/',
      name: 'StartingQuizView',
      component: () => import('../views/StartingQuizView.vue')
    }
  ]
})

export default router
