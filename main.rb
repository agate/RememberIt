require 'sinatra'

get '/' do
  haml :index
end

get '/m' do
  redirect '/'
end

get '/dictcn' do
	return `curl http://dict.cn/ws.php?q=#{params[:q]} | iconv -f GBK`
end
