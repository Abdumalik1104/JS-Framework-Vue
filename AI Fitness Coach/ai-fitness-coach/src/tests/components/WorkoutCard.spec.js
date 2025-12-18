import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WorkoutCard from '@/components/WorkoutCard.vue'

describe('WorkoutCard Component', () => {
  let wrapper
  const workout = {
    id: 1,
    title: 'Morning Cardio',
    duration: 30,
    difficulty: 'beginner',
    type: 'cardio',
    calories: 200,
    exercises: 5,
    completed: false,
    favorite: false
  }
  
  beforeEach(() => {
    setActivePinia(createPinia())
    
    wrapper = mount(WorkoutCard, {
      props: { workout },
      global: {
        stubs: ['router-link']
      }
    })
  })
  
  it('renders workout title correctly', () => {
    expect(wrapper.text()).toContain(workout.title)
  })
  
  it('displays duration and calories', () => {
    expect(wrapper.text()).toContain(`${workout.duration} мин`)
    expect(wrapper.text()).toContain(`${workout.calories} ккал`)
  })
  
  it('shows difficulty badge', () => {
    expect(wrapper.find('.difficulty-badge').text()).toBe('Начинающий')
  })
  
  it('emits start-workout event when start button clicked', async () => {
    await wrapper.find('.start-button').trigger('click')
    expect(wrapper.emitted('start-workout')).toBeTruthy()
    expect(wrapper.emitted('start-workout')[0]).toEqual([workout.id])
  })
  
  it('emits toggle-favorite event when favorite button clicked', async () => {
    await wrapper.find('.favorite-button').trigger('click')
    expect(wrapper.emitted('toggle-favorite')).toBeTruthy()
    expect(wrapper.emitted('toggle-favorite')[0]).toEqual([workout.id])
  })
  
  it('applies correct difficulty class', () => {
    expect(wrapper.find('.workout-card').classes()).toContain('difficulty-beginner')
  })
  
  it('shows completed badge when workout is completed', async () => {
    await wrapper.setProps({ 
      workout: { ...workout, completed: true } 
    })
    
    expect(wrapper.find('.completed-badge').exists()).toBe(true)
  })
  
  it('shows favorite icon when workout is favorited', async () => {
    await wrapper.setProps({
      workout: { ...workout, favorite: true }
    })
    
    expect(wrapper.find('.favorite-button').text()).toContain('❤️')
  })
})

describe('WorkoutCard Accessibility', () => {
  it('has proper ARIA labels', () => {
    const workout = {
      id: 1,
      title: 'Test Workout',
      duration: 30,
      difficulty: 'beginner',
      calories: 200
    }
    
    const wrapper = mount(WorkoutCard, {
      props: { workout }
    })
    
    expect(wrapper.find('.start-button').attributes('aria-label')).toBe('Начать тренировку')
    expect(wrapper.find('.favorite-button').attributes('aria-label')).toBe('Добавить в избранное')
  })
  
  it('is keyboard accessible', async () => {
    const workout = {
      id: 1,
      title: 'Test Workout',
      duration: 30,
      difficulty: 'beginner',
      calories: 200
    }
    
    const wrapper = mount(WorkoutCard, {
      props: { workout }
    })
    
    const startButton = wrapper.find('.start-button')
    const favoriteButton = wrapper.find('.favorite-button')
    
    expect(startButton.attributes('tabindex')).toBe('0')
    expect(favoriteButton.attributes('tabindex')).toBe('0')
    
    // Test keyboard events
    await startButton.trigger('keydown.enter')
    expect(wrapper.emitted('start-workout')).toBeTruthy()
  })
})