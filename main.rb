require 'sinatra'

get '/' do
  haml :index
end

get '/m' do
  haml :mobile
end
