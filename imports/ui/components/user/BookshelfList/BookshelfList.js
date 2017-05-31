import React from 'react';

import Masonry from 'react-masonry-component/lib';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Works from '/imports/api/collections/works';

class BookshelfList extends React.Component {
	render() {
		const masonryOptions = {
			isFitWidth: true,
			transitionDuration: 300,
		};

		return (
			<div className="works-list works-list--bookshelf">
				{this.props.works && this.props.works.length ?
					<Masonry
						options={masonryOptions}
						className="works-container works-container--grid row"
					>
						{this.props.works.map((work, i) => (
							<WorkTeaser
								key={i}
								work={work}
							/>
						))}
					</Masonry>
				:
					<div>
						<p className="no-results no-results--bookshelf">
							You do not have any works saved on your bookshelf yet. <a href="/browse">Add one by browsing the corpora.</a>
						</p>
					</div>
				}
			</div>
		);
	}
};

BookshelfList.propTypes = {
	works: PropTypes.array,
};

const BookshelfListContainer = createContainer(props => {
	const query = {};
	let works = [];

	const shelfList = Meteor.users.findOne({
		_id: Meteor.userId(),
	}, {
		fields: {
			worksShelf: 1,
		},
	});

	if (shelfList && 'worksShelf' in shelfList) {
		query._id = {
			$in: [],
		};
		shelfList.worksShelf.forEach((workId) => {
			query._id.$in.push(new Meteor.Collection.ObjectID(workId));
		});

		const handle = Meteor.subscribe('works', query, 0, 100);
		if (handle.ready()) {
			works = Works.find(query,
				{
					sort: {
						english_tile: 1,
					},
				}
			).fetch();

			works.forEach((work, i) => {
				works[i].authors = Authors.find({
					_id: {
						$in: work.authors,
					},
				}).fetch();
			});
		}
	}

	works.sort((a, b) => {
		if (a.authors[0].english_name > b.authors[0].english_name) {
			return 1;
		} else if (b.authors[0].english_name > a.authors[0].english_name) {
			return -1;
		}
		return 0;
	});

	return {
		works,
	};
}, BookshelfList);

export default BookshelfListContainer;
