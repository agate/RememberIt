require 'sinatra'

get '/' do
  haml :index
end

get '/m' do
  redirect '/'
end
