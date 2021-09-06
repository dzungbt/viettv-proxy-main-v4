@echo off

set streamID=MLB15h
set port=8080
set tls=0
set prefetch=1
set verbosity=1

rem :: HLS url obtained using "WebCast-Reloaded" on webpage:
rem ::   https://www.mlbstream.io/tampa-bay-rays-vs-boston-red-sox-live/stream-1

set video_URL=https://e1.livecamtv.me/zmelive/Yiz2tBq735ycJQCAxGmL/playlist.m3u8
set play_in_VLC=0

set PATH=%~dp0..\..;%PATH%
set recipes_home=%~dp0..\..\..\..\..

call "%recipes_home%\.lib\LAN\print_proxied_url.bat" "%video_URL%" "%port%" "%tls%"

if "%play_in_VLC%"=="1" call "%recipes_home%\.bin\play_in_VLC.cmd" "%proxied_URL%"

seelive "%streamID%" "%port%" "%tls%" "%prefetch%" "%verbosity%"