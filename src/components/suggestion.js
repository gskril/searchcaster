import Link from 'next/link'

export default function Suggestion({ name, items }) {
	return (
		<div className="suggestion">
			<h2 className="h3">{name}</h2>
			<div className="suggestion__wrapper">
				{items.map((item, index) => (
					<Link key={index} href={item.href}>
						<a className="suggestion__item">{item.text}</a>
					</Link>
				))}
			</div>
		</div>
	)
}
