$:.unshift File.join(File.dirname(__FILE__), "..", "lib")
require 'rubygems'
require 'sinatra'
require 'lib/prelinger-tv.rb'
run PrelingerTV