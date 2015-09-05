	<!-- find protocols from here -->
									
										
									
									<div class="all_litrature" data-ng-init = "findprotocol()">	
											 <div class="new-note-wrap" ng-repeat="protocol in protocols | filter:searchnote">
											<div class="note-head clearfix">
													<span class="stars"></span>
													<span class="head-text">{{protocol.protocolname}}</span>
													<span class="file-format" ng-repeat="tag1 in pro_tag[protocol.id]">{{tag1}}</span>
													<div class="pull-right link-count-wrap">
														<a href="#" class="file-link"></a>
														<a href="#" class="file-count">1</a>
													</div>
											</div>
											
											<div class="row entry-wrap clearfix">
												<div class="col-md-10 col-sm-12 col-xs-12 padd-left">
													<div class="row">
														<div class="col-md-12 col-sm-12 col-xs-12">
															<span class="date-det"><strong>ENTRY TYPE:</strong> Protocol </span>
																<span class="date-det"><strong>LAST UPDATED:</strong> {{protocol.updatedAt}}</span>
																
													</div>
													<div class="col-md-3 col-sm-3 col-xs-12">
														<a href="#" class="detail-img-name clearfix">
														<img src=<%= user.profilepic %> />
														<span>{{protocol.creater}} </span>											 
														</a>
														
													</div>
												</div>
											</div>
											<div class="col-md-2 col-sm-12 col-xs-12">
												<a href="#" class="edit-entry">EDIT ENTRY</a>
												<a href="#" class="see-history">SEE HISTORY</a>
											</div>
											<!--<div class="col-md-12 col-sm-12 col-xs-12 dwn-pragraph">{{note.description}}</div>-->
										</div>	
										
								
									
									<!-- find experiments from here -->
									
										
									
									<div class="all_litrature" data-ng-init = "findexperiments()">	
											 <div class="new-note-wrap" ng-repeat="exp in experiments | filter:searchnote">
											<div class="note-head clearfix">
													<span class="stars"></span>
													<span class="head-text">{{exp.experimentname}}</span>
													<span class="file-format" ng-repeat="tag1 in exp_tag[exp.id]">{{tag1}}</span>
													<div class="pull-right link-count-wrap">
														<a href="#" class="file-link"></a>
														<a href="#" class="file-count">1</a>
													</div>
											</div>
											
											<div class="row entry-wrap clearfix">
												<div class="col-md-10 col-sm-12 col-xs-12 padd-left">
													<div class="row">
														<div class="col-md-12 col-sm-12 col-xs-12">
															<span class="date-det"><strong>ENTRY TYPE:</strong> Experiments </span>
																<span class="date-det"><strong>LAST UPDATED:</strong> {{exp.updatedAt}}</span>
																
													</div>
													<div class="col-md-3 col-sm-3 col-xs-12">
														<a href="#" class="detail-img-name clearfix">
														<img src=<%= user.profilepic %> />
														<span>{{exp.creater}} </span>											 
														</a>
														
													</div>
												</div>
											</div>
											<div class="col-md-2 col-sm-12 col-xs-12">
												<a href="#" class="edit-entry">EDIT ENTRY</a>
												<a href="#" class="see-history">SEE HISTORY</a>
											</div>
											<!--<div class="col-md-12 col-sm-12 col-xs-12 dwn-pragraph">{{note.description}}</div>-->
										</div>	
										
									</div>	