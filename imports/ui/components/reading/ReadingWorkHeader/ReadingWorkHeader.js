import React from 'react';
import PropTypes from 'prop-types';

class ReadingWorkHeader extends React.Component {

	render() {
		const { work } = this.props;

		return (
			<section className="page-head fullscreen image-bg ">

				<div className="background-image-holder less-blur blur">
					<img className="background-image" alt="background" src="/images/temple.jpg" />
				</div>

				<div className="background-screen reading-page-background-screen" />

				<div className="container v-align-transform">
					<div className="row">
						<div className="col-sm-10 col-sm-offset-1 text-center">
							<div className="work-authors">
								<a
									href={`/authors/${work.author}`}
									className="work-author"
								>
									<h4>
										{work.author}
										{/*
										{work.author}
										<span className="work-author-original-name">
											({author.original_name})
										</span>
										*/}
									</h4>
								</a>
							</div>

							<div className="work-title-outer">
								<h1 className="work-title">
									{work.englishtitle}
								</h1>
								{work.originaltitle ?
									<span className="work-original-title">
										{work.originaltitle}
									</span>
									:
									''
								}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

ReadingWorkHeader.propTypes = {
	work: PropTypes.object.isRequired,
};

export default ReadingWorkHeader;
