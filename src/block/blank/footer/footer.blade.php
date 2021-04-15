@php
	/**
	 * $logo string
	 * $contacts string
	 * $menu array
	 * $socials string
	 * $techart string
	 * $copyright string
	**/
@endphp
<div class="{{ $block }}">
	<div class="{{ $block->elem('middle') }}">
		<div class="{{ $block->elem('row') }}">
			<div class="{{ $block->elem('logo') }}">{!! $logo !!}</div>
			<div class="{{ $block->elem('contacts') }}">{!! $contacts !!}</div>
			<nav class="{{ $block->elem('menu') }}">
				<div class="{{ $block->elem('menu-items') }}">
					@foreach($menu as $menuItem)
						<a class="{{ $block->elem('menu-item') }}" href="{{ $menuItem['url'] }}">
							{!! $menuItem['title'] !!}
						</a>
					@endforeach
				</div>
			</nav>
			<div class="{{ $block->elem('last-column-wrap') }}">
				<div class="{{ $block->elem('last-column') }}">
					<div class="{{ $block->elem('socials') }}">{!! $socials !!}</div>
					<div class="{{ $block->elem('techart') }}">{!! $techart !!}</div>
					<div class="{{ $block->elem('copyright') }}">{{ $copyright }}</div>
				</div>
			</div>
		</div>
	</div>
</div>