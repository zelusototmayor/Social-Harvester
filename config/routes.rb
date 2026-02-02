Rails.application.routes.draw do
  # API routes
  namespace :api do
    # Stripe webhooks (must be before authentication)
    post 'webhooks/stripe', to: 'webhooks#stripe'

    # Waitlist (public endpoint)
    post 'waitlist', to: 'waitlist#create'

    # Authentication
    devise_for :users, path: 'auth', path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'register'
    },
    controllers: {
      sessions: 'api/auth/sessions',
      registrations: 'api/auth/registrations'
    }

    # Organizations (new)
    resources :organizations, only: [:index, :show, :create, :update] do
      member do
        post :switch
      end
    end

    # Products with nested influencers and hashtags
    resources :products do
      collection do
        post :analyze_url
      end
      member do
        get :dashboard
        get :leads
        post :trigger_scan
        get :scan_status
      end
      resources :influencers, only: [:index, :show, :create, :update, :destroy]
      resources :hashtags, only: [:index, :show, :create, :update, :destroy]
    end

    # Legacy campaigns routes (to be removed after migration)
    resources :campaigns do
      member do
        post :scrape
      end
    end

    resources :leads, only: [:index, :show, :update] do
      member do
        post :engage
      end
    end

    # Analytics
    get 'analytics/overview', to: 'analytics#overview'

    # Current user info
    get 'me', to: 'users#me'
    patch 'me/onboarding', to: 'users#complete_onboarding'

    # Subscriptions & Billing
    get 'subscriptions/current', to: 'subscriptions#current'
    get 'subscriptions/plans', to: 'subscriptions#plans'
    post 'subscriptions/checkout', to: 'subscriptions#checkout'
    post 'subscriptions/portal', to: 'subscriptions#portal'
    post 'subscriptions/cancel', to: 'subscriptions#cancel'
  end

  # Health check for load balancers
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Serve React app for all other routes
  # This allows React Router to handle client-side routing
  get '*path', to: 'static#index', constraints: ->(req) { !req.xhr? && req.format.html? }
  root to: 'static#index'
end
